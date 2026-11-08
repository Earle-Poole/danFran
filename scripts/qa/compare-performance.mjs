import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const beforePath = process.argv[2] ?? 'output/modernization/before/performance.json'
const afterPath = process.argv[3] ?? 'output/modernization/after/performance.json'
const outputPath = process.argv[4] ?? 'output/modernization/after/comparison.md'

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'))
const [before, after] = await Promise.all([readJson(beforePath), readJson(afterPath)])

const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]))
  }
  return value
}
const stable = (value) => JSON.stringify(canonicalize(value))
for (const key of ['runs', 'cacheMode', 'network', 'cpuThrottlingRate', 'routes', 'viewports']) {
  if (stable(before[key]) !== stable(after[key])) {
    throw new Error(`Cannot compare performance: ${key} differs between baseline and after run`)
  }
}

const median = (values) => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b)
  if (sorted.length === 0) return null
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}
const format = (value, digits = 0) => value === null ? 'n/a' : value.toFixed(digits)
const change = (previous, current, unit = '%') => {
  if (!Number.isFinite(previous) || !Number.isFinite(current) || previous === 0) return 'n/a'
  return `${format(((current - previous) / previous) * 100, 1)}${unit}`
}
const groupBy = (results) => {
  const grouped = new Map()
  for (const result of results) {
    const key = `${result.route}\t${result.viewport.name}`
    const values = grouped.get(key) ?? []
    values.push(result)
    grouped.set(key, values)
  }
  return grouped
}
const beforeGroups = groupBy(before.results)
const afterGroups = groupBy(after.results)
const rows = []

for (const route of before.routes) {
  for (const viewport of before.viewports) {
    const key = `${route}\t${viewport.name}`
    const previousRuns = beforeGroups.get(key) ?? []
    const currentRuns = afterGroups.get(key) ?? []
    if (previousRuns.length !== before.runs || currentRuns.length !== after.runs) {
      throw new Error(`Cannot compare performance: expected ${before.runs} samples for ${route} @ ${viewport.name}`)
    }
    const previous = {
      status: median(previousRuns.map((run) => run.responseStatus)),
      js: median(previousRuns.map((run) => run.jsTransferBytes)),
      transfer: median(previousRuns.map((run) => run.transferBytes)),
      lcp: median(previousRuns.map((run) => run.webVitals?.lcp?.time)),
      cls: median(previousRuns.map((run) => run.webVitals?.cls)),
    }
    const current = {
      status: median(currentRuns.map((run) => run.responseStatus)),
      js: median(currentRuns.map((run) => run.jsTransferBytes)),
      transfer: median(currentRuns.map((run) => run.transferBytes)),
      lcp: median(currentRuns.map((run) => run.webVitals?.lcp?.time)),
      cls: median(currentRuns.map((run) => run.webVitals?.cls)),
    }
    rows.push({ route, viewport, previous, current })
  }
}

const table = rows.map(({ route, viewport, previous, current }) =>
  `| \`${route}\` | ${viewport.name} | ${previous.status} → ${current.status} | ${format(previous.js)} → ${format(current.js)} (${change(previous.js, current.js)}) | ${format(previous.lcp)} → ${format(current.lcp)} ms (${change(previous.lcp, current.lcp)}) | ${format(previous.cls, 4)} → ${format(current.cls, 4)} (Δ ${format(current.cls === null || previous.cls === null ? null : current.cls - previous.cls, 4)}) | ${format(previous.transfer)} → ${format(current.transfer)} |`,
).join('\n')

const report = `# Modernization performance comparison

Baseline: \`${beforePath}\` (${before.generatedAt})

After: \`${afterPath}\` (${after.generatedAt})

Both artifacts report ${before.runs} ${before.cacheMode} samples with ${before.cpuThrottlingRate}× CPU throttling, ${before.network.latency} ms latency, and ${(before.network.downloadThroughput * 8 / 1024 / 1024).toFixed(2)} Mbps download. Values below are medians. LCP and CLS are laboratory observations from this harness, not field Core Web Vitals.

| Route | Viewport | HTTP status | JS transfer bytes | LCP | CLS | Total settled transfer bytes |
|---|---|---:|---:|---:|---:|---:|
${table}

Negative percentage changes in JS transfer and LCP mean lower measurements after the change. The event-detail route is new and has no matching before measurement; this comparison covers only routes present in the saved baseline.
`

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, report, 'utf8')
console.log(`Wrote ${outputPath}`)
