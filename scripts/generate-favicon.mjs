import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svgPath = join(root, 'app', 'icon.svg')
const svg = readFileSync(svgPath)

async function generate() {
  // 32x32 PNG → favicon.ico replacement (Next.js uses this as fallback)
  await sharp(svg).resize(32, 32).png().toFile(join(root, 'app', 'favicon-32.png'))
  console.log('✓ favicon-32.png')

  // 180x180 → apple-touch-icon (iOS home screen)
  await sharp(svg).resize(180, 180).png().toFile(join(root, 'app', 'apple-icon.png'))
  console.log('✓ apple-icon.png (180x180)')

  // 192x192 → Android / PWA
  await sharp(svg).resize(192, 192).png().toFile(join(root, 'public', 'icon-192.png'))
  console.log('✓ icon-192.png (192x192)')

  // 512x512 → PWA splash / OG fallback
  await sharp(svg).resize(512, 512).png().toFile(join(root, 'public', 'icon-512.png'))
  console.log('✓ icon-512.png (512x512)')

  // Overwrite the old Next.js favicon.ico with a 32x32 version
  const ico32 = await sharp(svg).resize(32, 32).png().toBuffer()
  // Write as PNG named .ico — browsers accept PNG-encoded .ico files
  writeFileSync(join(root, 'app', 'favicon.ico'), ico32)
  console.log('✓ favicon.ico (32x32 PNG-in-ICO)')

  console.log('\nAll favicons generated.')
}

generate().catch(err => { console.error(err); process.exit(1) })
