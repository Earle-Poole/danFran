import path from 'node:path'
import { expect, test } from '@playwright/test'
import { blockExternalRequests } from '../helpers/playwright-network'

test('captures a baseline home composition for review', async ({ page }, testInfo) => {
  await blockExternalRequests(page)
  await page.goto('/')
  await expect(page.locator('#home')).toBeVisible()

  const outputPath = path.resolve(
    process.cwd(),
    'docs/reports/QA-M2/visual',
    `${testInfo.project.name}.png`
  )
  await page.screenshot({ path: outputPath, fullPage: true })
})
