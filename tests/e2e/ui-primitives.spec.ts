import path from 'node:path'
import { expect, test } from '@playwright/test'
import { getPageAccessibilityResults } from '../helpers/accessibility'
import { blockExternalRequests } from '../helpers/playwright-network'

test.beforeEach(async ({ page }) => {
  await blockExternalRequests(page)
  await page.goto('/')
})

test('loads real fonts and original source images', async ({ page }) => {
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('400 32px Anton'),
      document.fonts.load('400 16px Inter'),
    ])
  })

  await expect
    .poll(
      () =>
        page.locator('img').evaluateAll((images) =>
          images.every(
            (image) => {
              const imageElement = image as HTMLImageElement
              return (
                imageElement.complete &&
                imageElement.naturalWidth > 0 &&
                imageElement.naturalHeight > 0
              )
            },
          ),
        ),
      { timeout: 5000 },
    )
    .toBe(true)

  const media = await page.evaluate(() => ({
    anton: document.fonts.check('400 32px Anton'),
    inter: document.fonts.check('400 16px Inter'),
    fontRequests: performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((name) => name.includes('/fonts/')),
    images: Array.from(document.images).map((image) => ({
      alt: image.alt,
      src: image.getAttribute('src'),
      width: image.naturalWidth,
      height: image.naturalHeight,
    })),
  }))

  expect(media.anton).toBe(true)
  expect(media.inter).toBe(true)
  expect(media.fontRequests.some((name) => name.includes('Anton-Regular.subset.woff2'))).toBe(true)
  expect(media.fontRequests.some((name) => name.includes('InterVariable.subset.woff2'))).toBe(true)
  expect(media.images).toHaveLength(2)
  for (const image of media.images) {
    expect(image.alt).toContain('Daniel Franzese')
    expect(image.src).toContain('/assets/about_me_photo1.webp')
    expect(image.width).toBeGreaterThan(0)
    expect(image.height).toBeGreaterThan(0)
  }

  await page.screenshot({
    path: path.resolve(process.cwd(), 'docs/reports/QA-M2/visual/ui-fixture-1440.png'),
    fullPage: true,
  })
})

test('announces loading without losing the action state or usable dimensions', async ({ page }) => {
  const button = page.getByRole('button', { name: /Save a long action label/ })
  const before = await button.boundingBox()

  await button.click()

  const loadingButton = page.getByRole('button', { name: /Saving long action label/ })
  await expect(loadingButton).toBeDisabled()
  await expect(loadingButton).toHaveAttribute('aria-busy', 'true')
  await expect(page.locator('[role="status"]').filter({ hasText: 'Loading' })).toHaveText('Loading')
  const after = await loadingButton.boundingBox()

  expect(before).not.toBeNull()
  expect(after).not.toBeNull()
  expect(after?.height).toBe(before?.height)
  expect(after?.width).toBeGreaterThanOrEqual(200)
  expect(Math.abs((after?.width ?? 0) - (before?.width ?? 0))).toBeLessThanOrEqual(1)
})

test('keeps disabled actions and links out of navigation', async ({ page }) => {
  const disabledButton = page.getByRole('button', { name: 'Disabled action' })
  await expect(disabledButton).toBeDisabled()
  await expect(disabledButton).toHaveAttribute('aria-describedby', 'disabled-help')

  const disabledLink = page.locator('a[aria-disabled="true"]').filter({ hasText: 'Disabled link action' })
  await expect(disabledLink).toHaveAttribute('aria-disabled', 'true')
  await expect(disabledLink).not.toHaveAttribute('href')
  await expect(disabledLink).toHaveAttribute('tabindex', '-1')
  await expect(disabledLink).toHaveAttribute('aria-describedby', 'disabled-link-help')

  const link = page.getByRole('link', { name: 'Read the text link state' })
  await link.click()
  await expect(page).toHaveURL(/#success$/)
})

test('connects field naming, descriptions, errors and success status', async ({ page }) => {
  const input = page.getByLabel('Booking contact email address')

  await expect(input).toHaveAttribute('aria-invalid', 'true')
  await expect(input).toHaveAttribute(
    'aria-describedby',
    'showcase-email-hint showcase-email-error'
  )
  await expect(page.locator('#showcase-email-error')).toContainText('Enter a valid email address')

  await page.getByRole('button', { name: 'Show success state' }).click()

  await expect(input).toHaveAttribute('aria-invalid', 'false')
  await expect(page.getByRole('status')).toContainText('Your details are ready to review')
  await expect(page.getByRole('alert')).toHaveCount(0)
})

test('shows a visible keyboard focus ring on the first action', async ({ page }) => {
  const button = page.getByRole('button', { name: /Save a long action label/ })
  await button.focus()

  await expect(button).toBeFocused()
  await expect
    .poll(() => button.evaluate((element) => getComputedStyle(element).outlineStyle))
    .toBe('solid')
})

test('does not create horizontal overflow at the required viewport widths', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    const dimensions = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }))

    expect(dimensions.body, `body overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport)
    expect(dimensions.document, `document overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport)
    await expect(page.getByText(/Long visible contact value/)).toBeVisible()
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.screenshot({
    path: path.resolve(process.cwd(), 'docs/reports/QA-M2/visual/ui-fixture-390.png'),
    fullPage: true,
  })
})

test('respects forced colors and reduced motion without hiding controls', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
  await page.reload()

  const media = await page.evaluate(() => ({
    forcedColors: window.matchMedia('(forced-colors: active)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    transitionDuration: getComputedStyle(document.querySelector('button')!).transitionDuration,
    colorAudit: (() => {
      const systemColorKeywords = [
        'Canvas',
        'CanvasText',
        'ButtonFace',
        'ButtonText',
        'Field',
        'FieldText',
        'Highlight',
        'HighlightText',
        'LinkText',
        'VisitedText',
        'GrayText',
        'SelectedItem',
        'SelectedItemText',
      ]
      const probe = document.createElement('span')
      probe.style.position = 'fixed'
      probe.style.inlineSize = '1px'
      probe.style.blockSize = '1px'
      document.body.append(probe)
      const systemColors = new Set(
        systemColorKeywords.flatMap((keyword) => {
          probe.style.color = keyword
          const color = getComputedStyle(probe).color
          probe.style.backgroundColor = keyword
          const backgroundColor = getComputedStyle(probe).backgroundColor
          return [color, backgroundColor]
        }),
      )
      probe.remove()

      return ['button', 'input', '[role="status"], [role="alert"]'].map((selector) => {
        const element = document.querySelector(selector)
        const style = getComputedStyle(element!)
        const colors = [
          style.color,
          style.backgroundColor,
          style.borderTopColor,
          style.borderRightColor,
          style.borderBottomColor,
          style.borderLeftColor,
        ]
        return {
          selector,
          forcedColorAdjust: style.forcedColorAdjust,
          usesSystemColor: colors.some((color) => systemColors.has(color)),
          colors,
        }
      })
    })(),
  }))

  expect(media.forcedColors).toBe(true)
  expect(media.reducedMotion).toBe(true)
  expect(Number.parseFloat(media.transitionDuration)).toBeLessThanOrEqual(0.01)
  expect(
    media.colorAudit.every(({ usesSystemColor }) => usesSystemColor),
    JSON.stringify(media.colorAudit),
  ).toBe(true)
  await expect(page.getByRole('button', { name: /Save a long action label/ })).toBeVisible()
})

test('has no scoped axe violations in the primitive showcase', async ({ page }) => {
  const results = await getPageAccessibilityResults(page)
  expect(
    results.violations,
    results.violations
      .flatMap((violation) => violation.nodes.map((node) => `${violation.id}: ${node.html}`))
      .join('\n'),
  ).toEqual([])
})
