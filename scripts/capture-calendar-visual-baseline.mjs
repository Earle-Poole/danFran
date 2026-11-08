import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const baseURL = process.env.QA_VISUAL_BASE_URL ?? 'http://127.0.0.1:3181'
const outputDirectory = process.env.QA_VISUAL_OUTPUT ?? 'docs/reports/evidence'
const outputPrefix = process.env.QA_VISUAL_PREFIX ?? 'zero'
const cases = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'mobile-390', width: 390, height: 844 },
]

await mkdir(outputDirectory, { recursive: true })
const browser = await chromium.launch({ headless: true })

try {
  for (const viewport of cases) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: 'reduce',
      locale: 'en-US',
    })
    const page = await context.newPage()
    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.evaluate(async () => {
      await document.fonts?.ready
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y)
        await new Promise((resolve) => window.setTimeout(resolve, 40))
      }
      window.scrollTo(0, 0)
      await Promise.all(Array.from(document.images, async (image) => {
        if (image.complete) return
        await new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true })
          image.addEventListener('error', resolve, { once: true })
        })
      }))
      await document.fonts?.ready
    })
    await page.waitForTimeout(100)
    await page.screenshot({
      path: `${outputDirectory}/qa-visual-${outputPrefix}-${viewport.name}.png`,
      fullPage: true,
    })
    await context.close()
  }
} finally {
  await browser.close()
}
