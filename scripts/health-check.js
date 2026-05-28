const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

function classifyResponse(statusCode, latencyMs) {
  if (statusCode === null) return { alive: false, latencyMs: null }
  if (statusCode >= 500) return { alive: false, latencyMs: null }
  return { alive: true, latencyMs }
}

function buildStatusUpdate(alive, latencyMs) {
  return {
    alive,
    latencyMs: alive ? latencyMs : null,
    lastChecked: new Date().toISOString(),
  }
}

function pingUrl(url, timeoutMs = 5000) {
  return new Promise(resolve => {
    const start = Date.now()
    const lib = url.startsWith('https') ? https : http
    const req = lib.request(url, { method: 'GET', timeout: timeoutMs }, res => {
      res.resume()
      resolve({ statusCode: res.statusCode, latencyMs: Date.now() - start })
    })
    req.on('timeout', () => { req.destroy(); resolve({ statusCode: null, latencyMs: null }) })
    req.on('error', () => resolve({ statusCode: null, latencyMs: null }))
    req.end()
  })
}

async function run() {
  const dataPath = path.join(process.cwd(), 'data', 'apis.json')
  const historyPath = path.join(process.cwd(), 'data', 'history.json')
  const apis = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  const history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'))

  const today = new Date().toISOString().slice(0, 10)

  for (const api of apis) {
    console.log(`Checking ${api.name} (${api.url})...`)
    const { statusCode, latencyMs } = await pingUrl(api.url)
    const { alive, latencyMs: checkedLatency } = classifyResponse(statusCode, latencyMs)
    api.status = buildStatusUpdate(alive, checkedLatency)
    console.log(`  ${alive ? 'LIVE' : 'DOWN'} ${checkedLatency ? checkedLatency + 'ms' : ''}`)

    if (!history[api.id]) history[api.id] = []
    history[api.id].push({ date: today, alive, latencyMs: checkedLatency })
    if (history[api.id].length > 7) history[api.id] = history[api.id].slice(-7)
  }

  fs.writeFileSync(dataPath, JSON.stringify(apis, null, 2))
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2))
  console.log('Done. Updated apis.json and history.json.')
}

if (require.main === module) run().catch(console.error)

module.exports = { classifyResponse, buildStatusUpdate, pingUrl }
