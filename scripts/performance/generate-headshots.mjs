import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const sourceDirectory = process.argv[2]
if (!sourceDirectory) throw new Error('Pass the directory containing the supplied headshots.')

const repoRoot = fileURLToPath(new URL('../../', import.meta.url))
const assetDirectory = path.join(repoRoot, 'public/assets/headshots-2026')
const sources = [
  ['striped-shirt', 'Daniel Franzese-Headshot.jpeg', 'Daniel Franzese leaning forward in a navy striped shirt and white tank top'],
  ['city-portrait', 'fall-2026/6I3A5241.jpg', 'Daniel Franzese standing on a city sidewalk in a black T-shirt, jeans, and white sneakers'],
  ['night-portrait', 'fall-2026/6I3A5254.jpg', 'Daniel Franzese in a checked jacket beside a lit theater entrance at night'],
  ['brick-wall', 'fall-2026/6I3A5256.jpg', 'Daniel Franzese smiling in a black T-shirt against a red brick wall'],
  ['patterned-shirt-smile', 'fall-2026/Edit_Danny_L1330539.jpg', 'Daniel Franzese smiling in a patterned shirt and a colorful neck scarf'],
  ['patterned-shirt', 'fall-2026/Edit_Danny_L1330547.jpg', 'Daniel Franzese in a patterned shirt and neck scarf against a dark red backdrop'],
  ['camouflage-cap', 'fall-2026/Edit_Danny_L1340535.jpg', 'Daniel Franzese in a camouflage cap and white tank top against a red wall'],
  ['flat-cap', 'fall-2026/Edit_Danny_L1340981.jpg', 'Daniel Franzese wearing a brown flat cap and orange and tan jacket against a blue wall'],
  ['white-blazer', 'fall-2026/Edit_Danny_L1350062.jpg', 'Daniel Franzese in a white blazer and gold chain against a weathered brick wall'],
]

await mkdir(assetDirectory, { recursive: true })
const manifest = []
for (const [slug, source, alt] of sources) {
  const input = path.resolve(sourceDirectory, source)
  const filename = `daniel-franzese-${slug}.webp`
  const fullPath = path.join(assetDirectory, filename)
  const previewPath = path.join(assetDirectory, `preview-${filename}`)
  const full = await sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 }).toFile(fullPath)
  const preview = await sharp(input).rotate().resize({ width: 640, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 }).toFile(previewPath)
  manifest.push({
    id: `headshot-2026-${slug}`,
    filename,
    source,
    alt,
    width: full.width,
    height: full.height,
    bytes: full.size,
    previewWidth: preview.width,
    previewHeight: preview.height,
    previewBytes: preview.size,
  })
}

await writeFile(path.join(repoRoot, 'lib/content/headshots-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

// Refresh just the homepage derivatives whose source images have changed.
const homeSources = JSON.parse(await readFile(path.join(repoRoot, 'lib/content/home-image-sources.json'), 'utf8'))
for (const [name, { originalPath, widths }] of Object.entries(homeSources)) {
  if (!originalPath.startsWith('/assets/headshots-2026/')) continue
  for (const width of widths) {
    await sharp(path.join(repoRoot, 'public', originalPath))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 76, effort: 6 })
      .toFile(path.join(repoRoot, 'public/assets/derived/home', `${name}-${width}.webp`))
  }
}

const fullBytes = manifest.reduce((sum, image) => sum + image.bytes, 0)
const sourceBytes = (await Promise.all(sources.map(([, file]) => stat(path.resolve(sourceDirectory, file)))))
  .reduce((sum, file) => sum + file.size, 0)
console.log(`Prepared ${manifest.length} headshots. Full images ${(fullBytes / 1024 / 1024).toFixed(2)} MiB, supplied JPEGs ${(sourceBytes / 1024 / 1024).toFixed(2)} MiB.`)
