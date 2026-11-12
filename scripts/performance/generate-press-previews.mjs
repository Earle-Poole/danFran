import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const repoRoot = process.cwd()
const sourceRoot = path.join(repoRoot, 'public', 'assets', 'press_kit', 'pressPhotos')
const outputRoot = path.join(repoRoot, 'public', 'assets', 'derived', 'press')
const manifestPath = path.join(repoRoot, 'tests', 'fixtures', 'press-previews-manifest.json')
const targetBytes = 120 * 1024
const widths = [1200, 1000, 800]
const qualities = [72, 68, 64, 60, 56, 52, 48, 44, 40]

const pressSources = [
  ['download-press-dan-fran', 'DanFranPress_DanFran.webp'],
  ['download-press-dan-fran-1', 'DanFranPress_DanFran1.webp'],
  ['download-press-mean-girls', 'DanFranPress_MeanGirls.webp'],
  ['download-press-yass', 'DanFranPress_YASS_comedyTour.webp'],
  ...Array.from({ length: 16 }, (_, index) => [
    `download-press-pk-${String(index + 1).padStart(2, '0')}`,
    `pk${index + 1}.webp`,
  ]),
]

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')

const assertTrustedWebp = (bytes, sourcePath) => {
  if (!sourcePath.endsWith('.webp')) throw new Error(`Unexpected source extension: ${sourcePath}`)
  if (bytes.length < 12 || bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
    throw new Error(`Source is not a RIFF/WEBP file: ${sourcePath}`)
  }
}

const renderPreview = async (sourcePath) => {
  const sourceBytes = await readFile(sourcePath)
  assertTrustedWebp(sourceBytes, sourcePath)
  const sourceMetadata = await sharp(sourceBytes, { failOn: 'error', limitInputPixels: false }).metadata()
  if (sourceMetadata.format !== 'webp' || !sourceMetadata.width || !sourceMetadata.height) {
    throw new Error(`Source metadata is not a complete WebP image: ${sourcePath}`)
  }

  for (const width of widths) {
    for (const quality of qualities) {
      const output = await sharp(sourceBytes, { failOn: 'error', limitInputPixels: false })
        .resize({ width, fit: 'inside', withoutEnlargement: true })
        .webp({ quality, effort: 6, smartSubsample: true })
        .toBuffer()
      if (output.byteLength <= targetBytes) {
        const outputMetadata = await sharp(output, { failOn: 'error', limitInputPixels: false }).metadata()
        if (!outputMetadata.width || !outputMetadata.height || outputMetadata.format !== 'webp') {
          throw new Error(`Generated preview metadata is invalid: ${sourcePath}`)
        }
        return { sourceBytes, sourceMetadata, output, outputMetadata, width, quality }
      }
    }
  }

  throw new Error(`Could not produce a preview under ${targetBytes} bytes: ${sourcePath}`)
}

await mkdir(outputRoot, { recursive: true })
const entries = []

for (const [id, fileName] of pressSources) {
  const sourcePath = path.join(sourceRoot, fileName)
  const output = await renderPreview(sourcePath)
  const previewFileName = `${id}.webp`
  const outputPath = path.join(outputRoot, previewFileName)
  await writeFile(outputPath, output.output)
  entries.push({
    id,
    sourcePath: `/assets/press_kit/pressPhotos/${fileName}`,
    sourceSha256: sha256(output.sourceBytes),
    sourceBytes: output.sourceBytes.byteLength,
    sourceDimensions: { width: output.sourceMetadata.width, height: output.sourceMetadata.height },
    previewPath: `/assets/derived/press/${previewFileName}`,
    previewSha256: sha256(output.output),
    previewBytes: output.output.byteLength,
    previewDimensions: { width: output.outputMetadata.width, height: output.outputMetadata.height },
    format: 'webp',
    quality: output.quality,
    resizeWidth: output.width,
  })
}

await writeFile(manifestPath, `${JSON.stringify({
  schemaVersion: 1,
  generatedBy: 'scripts/performance/generate-press-previews.mjs',
  targetBytes,
  entries,
}, null, 2)}\n`)

console.log(JSON.stringify({ manifestPath, entries }, null, 2))
