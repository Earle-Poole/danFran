import { checkA11y, getAxeResults, injectAxe } from 'axe-playwright'
import type { Page } from '@playwright/test'
import type { AxeResults } from 'axe-core'

/** Optional axe scan for feature tests; callers choose the scope and rule policy. */
export async function checkPageAccessibility(
  page: Page,
  options: Parameters<typeof checkA11y>[2] = {}
): Promise<void> {
  await injectAxe(page)
  await checkA11y(page, undefined, options)
}

export async function getPageAccessibilityResults(page: Page): Promise<AxeResults> {
  await injectAxe(page)
  return getAxeResults(page)
}
