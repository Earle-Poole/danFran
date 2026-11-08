import assert from 'node:assert/strict'
import process from 'node:process'
import { chromium } from 'playwright'

const baseUrl = process.env.PERF_BASE_URL ?? 'http://127.0.0.1:3161'
const root = await fetch(`${baseUrl}/`)
assert.equal(root.status, 200)
for (const [name, expected] of [
  ['x-content-type-options', 'nosniff'],
  ['referrer-policy', 'strict-origin-when-cross-origin'],
  ['permissions-policy', 'camera=(), microphone=(), geolocation=()'],
]) {
  assert.equal(root.headers.get(name), expected, `${name} header mismatch`)
}
const csp = root.headers.get('content-security-policy-report-only')
assert.ok(csp?.includes("default-src 'self'"), 'report-only CSP is missing default-src')
assert.ok(csp?.includes('https://img.youtube.com'), 'report-only CSP is missing thumbnail provider')
assert.ok(csp?.includes('https://www.youtube.com'), 'report-only CSP is missing video frame provider')
assert.equal(root.headers.get('x-powered-by'), null, 'framework disclosure header should be absent')

const optimized = await fetch(`${baseUrl}/_next/image?url=%2Fassets%2Fabout_photo_2.webp&w=640&q=75`, {
  headers: { accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' },
})
assert.equal(optimized.status, 404, 'runtime optimizer should remain disabled pending native-image audit')

const rejected = await fetch(`${baseUrl}/_next/image?url=${encodeURIComponent('https://example.com/not-allowed.jpg')}&w=640&q=75`)
assert.notEqual(rejected.status, 200, 'runtime optimizer must not serve unapproved remote images while disabled')

for (const [fontPath, expectedBytes, maxBytes] of [
  ['/fonts/optimized/Anton-Regular.subset.woff2', 14812, 180000],
  ['/fonts/optimized/InterVariable.subset.woff2', 74620, 180000],
]) {
  const font = await fetch(`${baseUrl}${fontPath}`)
  assert.equal(font.status, 200)
  assert.match(font.headers.get('content-type') ?? '', /font\/woff2/i)
  const bytes = (await font.arrayBuffer()).byteLength
  assert.equal(bytes, expectedBytes, `${fontPath} byte size changed`)
  assert.ok(bytes <= maxBytes, `${fontPath} exceeds font budget`)
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const route of ['/', '/about', '/booking', '/press-kit', '/modeling-gallery', '/video-gallery']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page.addInitScript(() => {
      window.__m5CspViolations = []
      document.addEventListener('securitypolicyviolation', (event) => {
        window.__m5CspViolations.push({ blockedURI: event.blockedURI, directive: event.violatedDirective })
      })
    })
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(250)
    const violations = await page.evaluate(() => window.__m5CspViolations)
    assert.deepEqual(violations, [], `${route} produced report-only CSP violations`)
    await page.close()
  }
} finally {
  await browser.close()
}

console.log('M5 config contract checks passed: headers, disabled optimizer guard, and route CSP report-only evaluation.')
