import { mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const publicDirectory = new URL('../../public/', import.meta.url)
const outputDirectory = new URL('assets/derived/home/', publicDirectory)
const sources = JSON.parse(await readFile(new URL('../../lib/content/home-image-sources.json', import.meta.url), 'utf8'))

await mkdir(outputDirectory, { recursive: true })

for (const [name, { originalPath, widths }] of Object.entries(sources)) {
  const original = fileURLToPath(new URL(`.${originalPath}`, publicDirectory))
  for (const width of widths) {
    const output = fileURLToPath(new URL(`${name}-${width}.webp`, outputDirectory))
    await sharp(original)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 76, effort: 6 })
      .toFile(output)
  }
}
