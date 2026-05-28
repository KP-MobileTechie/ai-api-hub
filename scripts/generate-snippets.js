const fs = require('fs')
const path = require('path')
const https = require('https')

function groqRequest(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    })
    const req = https.request({
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).choices[0].message.content)
        } catch (e) {
          reject(new Error('Bad response: ' + data.slice(0, 200)))
        }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function makePrompt(api, lang) {
  const langMap = { python: 'Python', javascript: 'JavaScript (ESM, async/await)', curl: 'cURL' }
  return `Write a minimal working code snippet in ${langMap[lang]} that calls the ${api.name} API (${api.url}).

Use this exact API structure: ${JSON.stringify({ id: api.id, auth: api.auth, models: api.models.slice(0, 2) })}

Rules:
- Use placeholder YOUR_KEY for the API key
- Show a simple chat completion or the primary use case for this API
- Keep it under 15 lines
- Return ONLY the code, no explanation, no markdown fences`
}

async function generateForApi(api) {
  const snippets = {}
  for (const lang of ['python', 'javascript', 'curl']) {
    console.log(`  Generating ${lang} snippet...`)
    snippets[lang] = await groqRequest(makePrompt(api, lang))
    await new Promise(r => setTimeout(r, 500))
  }
  return snippets
}

async function run() {
  const args = process.argv.slice(2)
  const idFlag = args.indexOf('--id')
  const targetId = idFlag !== -1 ? args[idFlag + 1] : null

  if (!targetId) {
    console.error('Usage: node scripts/generate-snippets.js --id <api-id>')
    process.exit(1)
  }

  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY environment variable is required')
    process.exit(1)
  }

  const dataPath = path.join(process.cwd(), 'data', 'apis.json')
  const apis = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  const api = apis.find(a => a.id === targetId)

  if (!api) {
    console.error(`No API with id "${targetId}" found in apis.json`)
    process.exit(1)
  }

  console.log(`Generating snippets for ${api.name}...`)
  api.snippets = await generateForApi(api)

  fs.writeFileSync(dataPath, JSON.stringify(apis, null, 2))
  console.log(`Done. Snippets written to apis.json for ${api.name}.`)
}

run().catch(console.error)
