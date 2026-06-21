const fs = require('fs')
const path = require('path')

const UP_COLOR = '#10b981'
const DOWN_COLOR = '#ef4444'
const LABEL_COLOR = '#555'

// Rough character width estimate (px) for the default shields-style font at 11px.
function textWidth(str) {
  return str.length * 7 + 10
}

function escapeXml(str) {
  return String(str).replace(/[<>&'"]/g, c => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  }[c]))
}

function renderBadge(label, message, alive) {
  const color = alive ? UP_COLOR : DOWN_COLOR
  const labelW = textWidth(label)
  const msgW = textWidth(message)
  const totalW = labelW + msgW
  const labelText = escapeXml(label)
  const msgText = escapeXml(message)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="20" role="img" aria-label="${labelText}: ${msgText}">
  <title>${labelText}: ${msgText}</title>
  <rect width="${labelW}" height="20" fill="${LABEL_COLOR}"/>
  <rect x="${labelW}" width="${msgW}" height="20" fill="${color}"/>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${labelW / 2}" y="14">${labelText}</text>
    <text x="${labelW + msgW / 2}" y="14">${msgText}</text>
  </g>
</svg>
`
}

function generateBadges(cwd = process.cwd()) {
  const dataPath = path.join(cwd, 'data', 'apis.json')
  const outDir = path.join(cwd, 'public', 'badge')
  const apis = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  fs.mkdirSync(outDir, { recursive: true })

  const written = []
  for (const api of apis) {
    const alive = !!(api.status && api.status.alive)
    const svg = renderBadge(api.name, alive ? 'up' : 'down', alive)
    const file = path.join(outDir, `${api.id}.svg`)
    fs.writeFileSync(file, svg)
    written.push(file)
  }
  return written
}

if (require.main === module) {
  const written = generateBadges()
  console.log(`Wrote ${written.length} badge(s) to public/badge/.`)
}

module.exports = { generateBadges, renderBadge }
