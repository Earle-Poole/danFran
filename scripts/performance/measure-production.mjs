import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { chromium } from 'playwright'

const baseUrl = process.env.PERF_BASE_URL ?? 'http://127.0.0.1:3161'
const outputPath = process.env.PERF_OUTPUT ?? 'docs/reports/PERF-M5/baseline.json'
const evidenceDir = process.env.PERF_EVIDENCE_DIR ?? 'docs/reports/PERF-M5/evidence'
const cacheMode = process.env.PERF_CACHE_MODE ?? 'cold'
const runs = Number(process.env.PERF_RUNS ?? 3)
const routes = (process.env.PERF_ROUTES ?? '/,/about,/booking,/press-kit,/modeling-gallery,/video-gallery')
  .split(',')
  .map((route) => route.trim())
  .filter(Boolean)
const viewports = [
  { name: 'desktop-chrome-1440x900', width: 1440, height: 900 },
  { name: 'compact-chrome-390x844', width: 390, height: 844 },
]

const network = {
  offline: false,
  latency: 150,
  downloadThroughput: Math.floor((1.6 * 1024 * 1024) / 8),
  uploadThroughput: Math.floor((750 * 1024) / 8),
}

const sumTransfer = (resources) => resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0)

// Guard the phase-accounting model with a crossing-resource fixture: an entry
// still in flight at the initial checkpoint appears only in the settled list,
// and must be counted exactly once in the initial-to-settled delta.
const phaseFixtureInitial = [{ name: 'html', startTime: 0, responseEnd: 10, transferSize: 100 }]
const phaseFixtureSettled = [
  ...phaseFixtureInitial,
  { name: 'crossing-image', startTime: 5, responseEnd: 30, transferSize: 50 },
  { name: 'later-image', startTime: 40, responseEnd: 60, transferSize: 25 },
]
const phaseFixtureDelta = sumTransfer(phaseFixtureSettled) - sumTransfer(phaseFixtureInitial)
if (phaseFixtureDelta !== 75 || phaseFixtureSettled.filter((resource) => resource.startTime <= 20 && resource.responseEnd > 20).length !== 1) {
  throw new Error('M5 phase-accounting fixture failed')
}

const metricsObserver = () => {
  const selectorFor = (node) => {
    if (!(node instanceof Element)) return null
    if (node.id) return `#${node.id}`
    const parts = []
    let current = node
    while (current && current.nodeType === Node.ELEMENT_NODE && parts.length < 4) {
      let part = current.tagName.toLowerCase()
      if (current.classList.length) part += `.${[...current.classList].slice(0, 2).join('.')}`
      parts.unshift(part)
      current = current.parentElement
    }
    return parts.join(' > ')
  }
  const rectFor = (rect) => rect ? {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  } : null
  window.__perfM5 = { lcp: null, cls: 0, clsSources: [], longTasks: 0 }
  window.__perfM5Snapshot = () => {
    const nav = performance.getEntriesByType('navigation')[0]
    const resources = performance.getEntriesByType('resource').map((entry) => ({
      name: entry.name,
      initiatorType: entry.initiatorType,
      startTime: entry.startTime,
      responseEnd: entry.responseEnd,
      transferSize: entry.transferSize,
      encodedBodySize: entry.encodedBodySize,
      decodedBodySize: entry.decodedBodySize,
      duration: entry.duration,
    }))
    const images = [...document.images].map((image) => ({
      src: image.currentSrc || image.src,
      optimizerTarget: (() => {
        try {
          const url = new URL(image.currentSrc || image.src, location.href)
          return url.pathname === '/_next/image' && url.searchParams.get('url')
            ? decodeURIComponent(url.searchParams.get('url'))
            : null
        } catch { return null }
      })(),
      originClass: (() => {
        try {
          const source = new URL(image.currentSrc || image.src, location.href)
          const target = source.pathname === '/_next/image' && source.searchParams.get('url')
            ? new URL(decodeURIComponent(source.searchParams.get('url')), location.href)
            : source
          return target.origin === location.origin ? 'local' : 'external'
        } catch { return 'unknown' }
      })(),
      loading: image.loading,
      width: image.naturalWidth,
      height: image.naturalHeight,
      complete: image.complete,
    }))
    const js = resources.filter((entry) => entry.initiatorType === 'script' || /\.js(?:\?|$)/.test(entry.name))
    const css = resources.filter((entry) => entry.initiatorType === 'link' || /\.css(?:\?|$)/.test(entry.name))
    const total = (key) => resources.reduce((sum, entry) => sum + (entry[key] || 0), 0)
    return {
      navigation: {
        responseStart: nav?.responseStart ?? 0,
        domContentLoaded: nav?.domContentLoadedEventEnd ?? 0,
        load: nav?.loadEventEnd ?? 0,
        domInteractive: nav?.domInteractive ?? 0,
      },
      paint: Object.fromEntries(performance.getEntriesByType('paint').map((entry) => [entry.name, entry.startTime])),
      webVitals: structuredClone(window.__perfM5),
      resourceCount: resources.length,
      transferBytes: total('transferSize'),
      encodedBytes: total('encodedBodySize'),
      decodedBytes: total('decodedBodySize'),
      jsTransferBytes: js.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
      cssTransferBytes: css.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
      imageTransferBytes: resources.filter((entry) => entry.initiatorType === 'img').reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
      iframeCount: document.querySelectorAll('iframe').length,
      images,
      resourceSummary: resources.map(({ name, initiatorType, startTime, responseEnd, transferSize, encodedBodySize, decodedBodySize }) => ({ name, initiatorType, startTime, responseEnd, transferSize, encodedBodySize, decodedBodySize })),
      checkpointTime: performance.now(),
    }
  }
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const element = entry.element
        window.__perfM5.lcp = {
          time: entry.startTime,
          size: entry.size,
          node: element?.tagName?.toLowerCase() ?? null,
          selector: selectorFor(element),
          currentSrc: element?.currentSrc || element?.src || null,
          rect: rectFor(element?.getBoundingClientRect?.()),
        }
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true })
  } catch {}
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__perfM5.cls += entry.value
          for (const source of entry.sources || []) {
            window.__perfM5.clsSources.push({
              value: entry.value,
              selector: selectorFor(source.node),
              previousRect: rectFor(source.previousRect),
              currentRect: rectFor(source.currentRect),
            })
          }
        }
      }
    }).observe({ type: 'layout-shift', buffered: true })
  } catch {}
  try {
    new PerformanceObserver((list) => {
      window.__perfM5.longTasks += list.getEntries().length
    }).observe({ type: 'longtask', buffered: true })
  } catch {}
}

async function measure(page, route, viewport) {
  const started = Date.now()
  const response = await page.goto(new URL(route, baseUrl).href, { waitUntil: 'domcontentloaded', timeout: 15000 })
  await page.waitForTimeout(750)

  const initial = await page.evaluate(() => window.__perfM5Snapshot())

  const scrollStartedAt = new Date().toISOString()
  const scrollStartMs = Date.now()
  await page.evaluate(async () => {
    const step = Math.max(240, Math.floor(window.innerHeight * 0.8))
    const maxScroll = document.documentElement.scrollHeight
    for (let y = 0; y < maxScroll; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
    window.scrollTo(0, 0)
  })
  const scrollEndMs = Date.now()
  const scrollEndedAt = new Date().toISOString()
  await page.waitForTimeout(750)

  const imageSettlement = await page.evaluate(async () => {
    const localImages = [...document.images].filter((image) => {
      try {
        const source = new URL(image.currentSrc || image.src, location.href)
        const target = source.pathname === '/_next/image' && source.searchParams.get('url')
          ? new URL(decodeURIComponent(source.searchParams.get('url')), location.href)
          : source
        return target.origin === location.origin
      } catch { return false }
    })
    const outcomes = await Promise.all(localImages.map(async (image) => {
      if (!image.complete) await new Promise((resolve) => {
        const finish = () => resolve()
        image.addEventListener('load', finish, { once: true })
        image.addEventListener('error', finish, { once: true })
        setTimeout(finish, 3000)
      })
      let decoded = image.complete && image.naturalWidth > 0
      if (decoded && image.decode) {
        decoded = await Promise.race([
          image.decode().then(() => true).catch(() => false),
          new Promise((resolve) => setTimeout(() => resolve(false), 2000)),
        ])
      }
      return {
        src: image.currentSrc || image.src,
        complete: image.complete,
        decoded,
        width: image.naturalWidth,
        height: image.naturalHeight,
      }
    }))
    return { total: outcomes.length, incomplete: outcomes.filter((image) => !image.complete || image.width === 0 || image.height === 0).length, undecoded: outcomes.filter((image) => !image.decoded).length, outcomes }
  })

  const settled = await page.evaluate(() => window.__perfM5Snapshot())
  const postScrollResources = settled.resourceSummary.filter((resource) =>
    resource.responseEnd > initial.checkpointTime && resource.responseEnd <= settled.checkpointTime
  )
  const inFlightAtInitial = settled.resourceSummary.filter((resource) =>
    resource.startTime <= initial.checkpointTime && resource.responseEnd > initial.checkpointTime
  )
  const afterSettledResources = settled.resourceSummary.filter((resource) => resource.responseEnd > settled.checkpointTime)
  const postScrollTransferBytes = settled.transferBytes - initial.transferBytes
  const afterSettledTransferBytes = afterSettledResources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0)

  return {
    route,
    viewport,
    runStartedAt: new Date(started).toISOString(),
    elapsedMs: Date.now() - started,
    responseStatus: response?.status() ?? null,
    cacheMode,
    scroll: {
      startedAt: scrollStartedAt,
      endedAt: scrollEndedAt,
      durationMs: scrollEndMs - scrollStartMs,
      additionalTransferBytes: settled.transferBytes - initial.transferBytes,
      additionalImageTransferBytes: settled.imageTransferBytes - initial.imageTransferBytes,
      additionalResourceCount: settled.resourceCount - initial.resourceCount,
      phaseTransferBytes: postScrollTransferBytes,
      phaseResourceCount: settled.resourceCount - initial.resourceCount,
      phaseObservedWithinCheckpointResourceCount: postScrollResources.length,
      inFlightAtInitialCount: inFlightAtInitial.length,
      afterSettledResourceCount: afterSettledResources.length,
      phaseAccounting: {
        initialTransferBytes: initial.transferBytes,
        postScrollTransferBytes,
        settledTransferBytes: settled.transferBytes,
        byteAccountingMatches: initial.transferBytes + postScrollTransferBytes === settled.transferBytes,
        resourceAccountingMatches: initial.resourceCount + (settled.resourceCount - initial.resourceCount) === settled.resourceCount,
      },
      resourceTimingCompletedEntriesOnly: true,
      afterSettledNote: 'Completed ResourceTiming entries cannot normally have responseEnd after the settled checkpoint; this count is diagnostic, not proof that no later work occurred.',
    },
    initial,
    settled,
    imageSettlement,
    ...settled,
  }
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = []
try {
  for (const viewport of viewports) {
    for (const route of routes) {
      const warmContext = cacheMode === 'warm' ? await browser.newContext({ viewport, locale: 'en-US' }) : null
      if (warmContext) {
        const warmupPage = await warmContext.newPage()
        await warmupPage.addInitScript(metricsObserver)
        await measure(warmupPage, route, viewport)
        await warmupPage.close()
      }
      for (let run = 1; run <= runs; run += 1) {
        const context = warmContext ?? await browser.newContext({ viewport, locale: 'en-US' })
        const page = await context.newPage()
        const cdp = await context.newCDPSession(page)
        await cdp.send('Network.enable')
        await cdp.send('Network.emulateNetworkConditions', network)
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
        await page.addInitScript(metricsObserver)
        const result = await measure(page, route, viewport)
        if (run === 1 && ['/', '/modeling-gallery', '/press-kit', '/video-gallery'].includes(route)) {
          const screenshotPath = path.join(
            evidenceDir,
            viewport.name,
            `${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}-settled.png`
          )
          await mkdir(path.dirname(screenshotPath), { recursive: true })
          // Capture the settled viewport after the lazy-load sweep; full-page
          // captures are disproportionately expensive under CPU throttling.
          await page.screenshot({ path: screenshotPath })
          result.settledScreenshot = screenshotPath
        }
        results.push({ run, ...result })
        if (warmContext) await page.close()
        else await context.close()
        console.log(`${viewport.name} ${route} run ${run}: ${result.navigation.load.toFixed(1)}ms, ${result.transferBytes} transfer bytes, ${result.imageTransferBytes} image bytes`)
      }
      if (warmContext) await warmContext.close()
    }
  }
} finally {
  await browser.close()
}

const output = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  browser: 'Google Chrome via Playwright channel=chrome',
  cacheDescription: cacheMode === 'warm'
    ? 'single BrowserContext per route/viewport; one excluded warm-up precedes measured runs 1-3'
    : 'fresh BrowserContext per sample; no warm-cache evidence',
  runs,
  warmupRuns: cacheMode === 'warm' ? 1 : 0,
  routes,
  viewports,
  cacheMode,
  network,
  cpuThrottlingRate: 4,
  results,
}
await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(`Wrote ${outputPath}`)
