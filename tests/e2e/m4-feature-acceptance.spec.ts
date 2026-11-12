import { expect, test } from '@playwright/test'
import type { Route } from '@playwright/test'
import { getPageAccessibilityResults } from '../helpers/accessibility'
import {
  getM4RawPage,
  imageAttributeValues,
  installM4Network,
  m4AcceptanceEnabled,
  m4FixtureOrigin,
  modelingOriginalPaths,
  originalAssetReferences,
  pressOriginalPaths,
  videoTitles,
} from '../helpers/m4-acceptance'
import { readM5PressPreviewManifest } from '../helpers/m5-acceptance'
import { htmlAttribute, htmlTags } from '../helpers/m3-acceptance'
import { normalizeRobotsDirectives } from '../helpers/robots'

test.skip(!m4AcceptanceEnabled, 'M4 acceptance is enabled only on the integrated M4 baseline')

const indexableRoutes = ['/', '/about', '/press-kit', '/modeling-gallery', '/video-gallery', '/booking'] as const
const homeAliases = ['/', '/home'] as const
const m4Deployment = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV ?? 'development'

test.beforeEach(async ({ page }) => {
  await installM4Network(page)
})

test.describe('M4 Home, About and Booking journeys', () => {
  test('renders the required original imagery, hierarchy and primary actions', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Daniel Franzese', level: 1 })).toHaveCount(1)
    await expect(page.getByText('Actor / Comedian / Activist', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: /watch daniel/i })).toHaveAttribute('href', '/video-gallery')
    await expect(page.getByRole('link', { name: /booking inquiries/i })).toHaveAttribute('href', '/booking')
    const homeAssets = originalAssetReferences(await imageAttributeValues(page))
    expect(homeAssets).toContain('/assets/about_me_photo1.webp')
    expect(homeAssets).toContain('/assets/about_photo_2.webp')
    expect(homeAssets).toContain('/assets/modelling_gallery/mg (3).webp')
    expect(homeAssets).toContain('/assets/home_cover.webp')
    expect(homeAssets.every((asset) => !asset.includes('/output/') && !asset.includes('concept'))).toBe(true)

    await page.goto('/about')
    await expect(page.getByRole('heading', { name: 'More than a familiar face.', level: 1 })).toHaveCount(1)
    await expect(page.locator('#selected-work')).toBeVisible()
    expect(originalAssetReferences(await imageAttributeValues(page))).toContain('/assets/about_photo_2.webp')
    await expect(page.getByRole('link', { name: /speaking.*appearances/i })).toHaveAttribute(
      'href',
      '/booking#booking-details',
    )

    await page.goto('/booking')
    await expect(page.getByRole('heading', { name: /Let['’]s work together\./i, level: 1 })).toHaveCount(1)
    await expect(page.locator('#booking-details')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Email booking contact', exact: true })).toHaveAttribute(
      'href',
      /^mailto:Gary@AdvancedManagement\.tv/,
    )
    await expect(page.getByRole('link', { name: /call booking contact/i })).toHaveAttribute(
      'href',
      'tel:+14243331500',
    )
    for (const category of [
      'Theatrical & Public Appearances',
      'College & Speaking Engagements',
      'Press & Invites',
    ]) {
      await expect(page.getByText(category, { exact: true })).toBeVisible()
    }
  })

  test('preserves both home aliases and all legacy anchors as meaningful targets', async ({ page }) => {
    const aliasHeadings: string[] = []
    for (const route of homeAliases) {
      await page.goto(route)
      aliasHeadings.push(await page.getByRole('heading', { name: 'Daniel Franzese', level: 1 }).innerText())
      for (const fragment of ['home', 'about', 'cameo', 'contact']) {
        await expect(page.locator('#' + fragment)).toBeVisible()
      }
    }
    expect(aliasHeadings[0]).toBe(aliasHeadings[1])
    await page.goto('/home#about')
    const aboutTarget = page.locator('#about')
    await expect(aboutTarget).toBeVisible()
    await expect(aboutTarget.locator('[data-route-heading], h1, h2, h3').first()).toBeFocused()
    await page.goto('/#contact')
    const contactTarget = page.locator('#contact')
    await expect(contactTarget).toBeVisible()
    await expect(contactTarget.locator('[data-route-heading], h1, h2, h3').first()).toBeFocused()
  })

  test('keeps page contrast and focusable controls usable', async ({ page }) => {
    for (const route of ['/', '/about', '/booking']) {
      await page.goto(route)
      const results = await getPageAccessibilityResults(page)
      expect(results.violations.filter(({ id }) => id === 'color-contrast'), route).toEqual([])
      await expect(page.locator('main a, main button').first()).toBeVisible()
    }
  })
})

test.describe('M4 modeling gallery and press resources', () => {
  test('serves every modeling original and exposes one ordered accessible collection', async ({ page, request }) => {
    const badImageResponses: string[] = []
    page.on('response', (response) => {
      if (response.url().includes('/_next/image') && response.status() >= 400) badImageResponses.push(response.url())
    })
    await page.goto('/modeling-gallery')
    const downloadReferences = originalAssetReferences(
      await page.locator('main a[download]').evaluateAll((links) =>
        links.map((link) => link.getAttribute('href')).filter((href): href is string => Boolean(href)),
      ),
    )
    const modelingReferences = new Set(downloadReferences.filter((path) => path.includes('/modelling_gallery/mg (')))
    expect(modelingReferences.size).toBe(modelingOriginalPaths.length)
    expect(Array.from(modelingReferences)).toEqual(expect.arrayContaining(modelingOriginalPaths))
    expect(new Set(downloadReferences).size).toBe(27)
    for (const assetPath of modelingOriginalPaths) {
      const response = await request.get(assetPath)
      expect(response.status(), assetPath).toBe(200)
      expect(response.headers()['content-type']).toMatch(/^image\//)
    }
    expect(badImageResponses).toEqual([])
  })

  test('opens, navigates and closes the photo dialog with focus containment and return', async ({ page }) => {
    await page.goto('/modeling-gallery')
    const initiatingThumbnail = page.locator('main button:has(img)').first()
    await expect(initiatingThumbnail).toBeVisible()
    await initiatingThumbnail.click()
    const dialog = page.getByRole('dialog')
    await expect.poll(() => dialog.evaluate((element) => element.matches(':modal'))).toBe(true)
    await expect(dialog.getByRole('button', { name: /^close/i })).toBeFocused()
    const previous = dialog.getByRole('button', { name: /^previous/i })
    const next = dialog.getByRole('button', { name: /^next/i })
    const status = dialog.locator('#photo-dialog-status')
    const initialStatus = await status.innerText()
    const totalPhotos = Number(initialStatus.match(/of (\d+)/i)?.[1] ?? 0)
    expect(totalPhotos).toBeGreaterThanOrEqual(modelingOriginalPaths.length)
    await expect(previous).toBeDisabled()
    await expect(next).toBeEnabled()
    await page.keyboard.press('Tab')
    const insideDialog = await page.evaluate(() => Boolean(document.activeElement?.closest('dialog, [role="dialog"]')))
    expect(insideDialog).toBe(true)
    await next.click()
    await expect(status).toHaveText(new RegExp('Photo 2 of ' + totalPhotos, 'i'))
    await expect(previous).toBeEnabled()
    await previous.click()
    await expect(status).toHaveText(new RegExp('Photo 1 of ' + totalPhotos, 'i'))
    for (let index = 1; index < totalPhotos; index += 1) await next.click()
    await expect(status).toHaveText(new RegExp('Photo ' + totalPhotos + ' of ' + totalPhotos, 'i'))
    await expect(next).toBeDisabled()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(initiatingThumbnail).toBeFocused()
  })

  test('keeps a failed gallery image recoverable', async ({ page }) => {
    await page.unrouteAll()
    await installM4Network(page, { failGalleryPath: '/assets/modelling_gallery/mg (3).webp' })
    await page.goto('/modeling-gallery')
    await page.locator('main button:has(img)').first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByText(/Photo couldn’t load/i)).toBeVisible()
    await expect(dialog.getByRole('button', { name: /retry/i })).toBeVisible()
    await expect(dialog.getByRole('link', { name: /original file/i })).toBeVisible()
  })

  test('keeps press PDFs and photo previews distinct, reachable and truthful', async ({ page, request }) => {
    await page.goto('/press-kit')
    await expect(page.getByRole('heading', { name: 'Press kit.', level: 1 })).toHaveCount(1)
    for (const assetPath of [
      '/assets/press_kit/df-biography.pdf',
      '/assets/press_kit/yass-comedy-tour-description.pdf',
    ]) {
      const response = await request.get(assetPath)
      expect(response.status(), assetPath).toBe(200)
      expect(response.headers()['content-type']).toMatch(/application\/pdf/i)
      expect((await response.body()).byteLength).toBeGreaterThan(0)
    }
    for (const assetPath of pressOriginalPaths) {
      const response = await request.get(assetPath)
      expect(response.status(), assetPath).toBe(200)
      expect(response.headers()['content-type']).toMatch(/^image\//)
    }
    const pressAssets = originalAssetReferences(await imageAttributeValues(page))
    const pressManifest = readM5PressPreviewManifest()
    expect(
      new Set(pressAssets.filter((path) => path.includes('/assets/derived/press/'))),
    ).toEqual(new Set(pressManifest.map(({ previewPath }) => previewPath)))
    await expect(page.locator('main a[download]').first()).toBeVisible()
    await expect(page.getByRole('button', { name: /preview|view photo|enlarge/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /download/i }).first()).toBeVisible()
  })
})

test.describe('M4 videos and newsletter', () => {
  test('represents all ten videos and keeps filters in query/history state', async ({ page }) => {
    await page.goto('/video-gallery')
    await expect(page.getByRole('heading', { name: 'Press play.', level: 1 })).toHaveCount(1)
    for (const title of videoTitles) await expect(page.getByText(title, { exact: true }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'All videos', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: 'Comedy', exact: true }).click()
    await expect(page).toHaveURL(/\/video-gallery\?category=comedy(?:&|$)/)
    await expect(page.getByRole('button', { name: 'Comedy', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByText(/6 videos/i)).toBeVisible()
    await page.goBack()
    await expect(page).toHaveURL(/\/video-gallery\?category=all&video=video-shit-italian-moms-01$/)
    await expect(page.getByRole('button', { name: 'All videos', exact: true })).toHaveAttribute('aria-pressed', 'true')
  })

  test('hydrates valid deep video state and normalizes invalid state without autoplay', async ({ page }) => {
    await page.goto('/video-gallery?category=interviews-press&video=video-pop-trigger')
    await expect(page.getByRole('button', { name: 'Interviews & press', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(page.getByRole('heading', { name: 'Daniel Franzese Interview on Pop Trigger' })).toBeVisible()
    await expect(page.locator('iframe')).toHaveCount(0)
    await page.goto('/video-gallery?category=invalid&video=missing-video')
    await expect(page.getByRole('button', { name: 'All videos', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('heading', { name: 'Shit Italian Moms Say #1' })).toBeVisible()
    await expect(page).toHaveURL(/\/video-gallery\?category=all&video=video-shit-italian-moms-01$/)
    await expect(page.locator('iframe')).toHaveCount(0)
  })

  test('keeps filter history meaningful while selection remains non-playing', async ({ page }) => {
    await page.goto('/video-gallery')
    await page.getByRole('button', { name: 'Comedy', exact: true }).click()
    await expect(page).toHaveURL(/\/video-gallery\?category=comedy&video=video-shit-italian-moms-01$/)
    await page.getByRole('button', { name: 'Select Shit Italian Moms Say #2', exact: true }).click()
    await expect(page).toHaveURL(/\/video-gallery\?category=comedy&video=video-shit-italian-moms-02$/)
    await expect(page.locator('iframe')).toHaveCount(0)
    await page.goBack()
    await expect(page).toHaveURL(/\/video-gallery\?category=comedy&video=video-shit-italian-moms-01$/)
    await expect(page.getByRole('button', { name: 'Comedy', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('heading', { name: 'Shit Italian Moms Say #1' })).toBeVisible()
  })

  test('separates card selection from explicit play and limits embeds to one', async ({ page }) => {
    await page.goto('/video-gallery')
    await expect(page.locator('iframe')).toHaveCount(0)
    const card = page.getByRole('button', { name: /Shit Italian Moms Say #2/i }).first()
    await card.click()
    await expect(page.getByRole('heading', { name: /Shit Italian Moms Say #2/i }).last()).toBeFocused()
    await expect(page).toHaveURL(/\/video-gallery\?category=all&video=[^&]+$/)
    await page.getByRole('button', { name: /play.*Shit Italian Moms Say #2/i }).first().click()
    await expect(page.locator('iframe')).toHaveCount(1)
    await expect(page.locator('iframe')).toHaveAttribute('title', /Shit Italian Moms Say #2|YouTube/i)
    await expect(page.getByRole('link', { name: /watch.*youtube|youtube.*watch/i }).first()).toBeVisible()
  })

  test('recovers to a good selected thumbnail after a previous featured thumbnail fails', async ({ page }) => {
    await page.unrouteAll()
    await installM4Network(page, {
      allowVideoThumbnails: true,
      failVideoThumbnailId: 'eac91tZsZMw',
    })
    await page.goto('/video-gallery')
    await expect(page.getByRole('img', { name: /thumbnail unavailable/i }).first()).toBeVisible()
    await page.getByRole('button', { name: 'Select Shit Italian Moms Say #2', exact: true }).click()
    await expect(page.locator('img[src*="LCPV0sl4GdE"]').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Shit Italian Moms Say #2' }).last()).toBeFocused()
  })

  test('shows a provider-failure recovery state without leaving a dead player', async ({ page }) => {
    await page.unrouteAll()
    await installM4Network(page, { failVideoProvider: true })
    await page.goto('/video-gallery')
    await page.getByRole('button', { name: /play.*Shit Italian Moms Say #1/i }).first().click()
    await expect(page.getByText(/video.*unavailable|couldn’t load|could not load|watch on youtube/i).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /watch.*youtube|youtube.*watch/i }).first()).toBeVisible()
  })

  test('uses the same honest native newsletter handoff on Home and Videos', async ({ page }) => {
    for (const route of ['/', '/video-gallery']) {
      await installM4Network(page, { failNewsletter: true })
      await page.goto(route)
      const section = page
        .getByRole('heading', { name: 'Stay in the loop.' })
        .locator('xpath=ancestor::section[1]')
      const input = section.getByRole('textbox', { name: 'Email address' })
      const form = input.locator('xpath=ancestor::form[1]')
      const action = await form.getAttribute('action')
      expect(action).toMatch(/^https?:\/\//)
      expect(new URL(action!).hostname).not.toMatch(/127\.0\.0\.1|localhost/)
      const actionPattern = new URL(action!).origin + '/**'
      const contextPosts: Array<{ url: string; data: string }> = []
      const contextRoute = async (route: Route) => {
        const request = route.request()
        if (request.method() === 'POST') {
          contextPosts.push({ url: request.url(), data: decodeURIComponent(request.postData() ?? '') })
          await route.fulfill({ status: 503, contentType: 'text/plain', body: 'qa-fixture-newsletter-failure' })
          return
        }
        await route.abort('blockedbyclient')
      }
      await page.context().route(actionPattern, contextRoute)
      await expect(form).toHaveAttribute('method', 'post')
      await expect(form).toHaveAttribute('target', '_blank')
      await expect(form).not.toHaveAttribute('onsubmit')
      const inputId = await input.getAttribute('id')
      expect(inputId).toBeTruthy()
      const describedBy = await input.getAttribute('aria-describedby')
      expect(describedBy?.split(/\s+/)).toContain(inputId + '-hint')
      await expect(page.locator('#' + inputId + '-hint')).toBeVisible()
      await expect(section.getByText(/signup.*there|complete.*provider|new tab/i)).toBeVisible()
      await expect(input).toHaveAttribute('type', 'email')
      await expect(input).toHaveAttribute('autocomplete', 'email')
      await expect(input).toHaveAttribute('required', '')
      await input.fill('not-an-email')
      await form.getByRole('button', { name: /subscribe|continue to signup/i }).click()
      await expect(input).toHaveValue('not-an-email')
      await input.fill('qa-m4@example.invalid')
      await form.getByRole('button', { name: /subscribe|continue to signup/i }).click()
      await expect(input).toHaveValue('qa-m4@example.invalid')
      await page.context().unroute(actionPattern, contextRoute)
      expect(contextPosts.filter(({ url }) => url.startsWith(new URL(action!).origin))).toHaveLength(1)
      expect(contextPosts.find(({ url }) => url.startsWith(new URL(action!).origin))?.data).toContain(
        'qa-m4@example.invalid',
      )
      await expect(page.getByText(/successfully subscribed|you’re subscribed|you're subscribed/i)).toHaveCount(0)
      await page.unrouteAll()
      await installM4Network(page)
    }
  })
})

test.describe('M4 responsive, preferences and no-JavaScript behavior', () => {
  test('reflows without horizontal page overflow at required widths and zoom', async ({ page }) => {
    for (const viewport of [
      { width: 320, height: 844 },
      { width: 390, height: 844 },
      { width: 768, height: 900 },
      { width: 1024, height: 900 },
      { width: 1440, height: 900 },
      { width: 390, height: 480 },
    ]) {
      await page.setViewportSize(viewport)
      await page.goto('/about')
        const dimensions = await page.evaluate(() => ({
          body: document.body.scrollWidth,
          document: document.documentElement.scrollWidth,
          viewport: window.innerWidth,
    }))
      expect(dimensions.body, JSON.stringify(viewport)).toBeLessThanOrEqual(dimensions.viewport)
      expect(dimensions.document, JSON.stringify(viewport)).toBeLessThanOrEqual(dimensions.viewport)
      await expect(page.getByRole('heading', { name: 'More than a familiar face.', level: 1 })).toBeVisible()
    }
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '400%'
    })
    const zoomDimensions = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }))
    expect(zoomDimensions.body).toBeLessThanOrEqual(zoomDimensions.viewport)
    expect(zoomDimensions.document).toBeLessThanOrEqual(zoomDimensions.viewport)

    for (const route of ['/', '/video-gallery']) {
      for (const zoom of ['200%', '400%']) {
        await page.goto(route)
        await page.evaluate((fontSize) => {
          document.documentElement.style.fontSize = fontSize
        }, zoom)
        const newsletter = page
          .getByRole('heading', { name: 'Stay in the loop.' })
          .locator('xpath=ancestor::section[1]')
        const input = newsletter.getByRole('textbox', { name: 'Email address' })
        const submit = newsletter.getByRole('button', { name: 'Subscribe', exact: true })
        await expect(input).toBeVisible()
        await expect(submit).toBeVisible()
        const honeypot = newsletter.locator('input[name^="b_"]').first()
        const honeypotContainer = honeypot.locator('xpath=..')
        await expect(honeypotContainer).toHaveCSS('width', '1px')
        await expect(honeypotContainer).toHaveCSS('height', '1px')
        await expect(honeypotContainer).toHaveCSS('clip-path', 'inset(50%)')
        await expect(honeypot).toHaveAttribute('tabindex', '-1')
        await expect(honeypotContainer).toHaveAttribute('aria-hidden', 'true')
        await input.focus()
        await page.keyboard.press('Tab')
        await expect(honeypot).not.toBeFocused()
        const dimensions = await page.evaluate(() => ({
          body: document.body.scrollWidth,
          document: document.documentElement.scrollWidth,
          viewport: window.innerWidth,
        }))
        expect(dimensions.body, `${route} ${zoom}`).toBeLessThanOrEqual(dimensions.viewport)
        expect(dimensions.document, `${route} ${zoom}`).toBeLessThanOrEqual(dimensions.viewport)
      }
    }
  })

  test('retains visible controls under forced colors and live reduced motion', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
    await page.goto('/booking')
    await expect(page.getByRole('heading', { name: /Let['’]s work together\./i, level: 1 })).toBeVisible()
    await expect(page.locator('main a, main button').first()).toBeVisible()
    await page.emulateMedia({ forcedColors: 'none', reducedMotion: 'no-preference' })
    await page.emulateMedia({ forcedColors: 'none', reducedMotion: 'reduce' })
    await expect(page.locator('main')).toBeVisible()
  })
})

test.describe('M4 no-JavaScript fallback', () => {
  test.use({ javaScriptEnabled: false })

  test('keeps new routes, gallery originals, downloads, video links and newsletter handoff available', async ({ page }) => {
    await page.goto('/about')
    await expect(page.getByRole('heading', { name: 'More than a familiar face.', level: 1 })).toBeVisible()
    await page.goto('/booking')
    await expect(page.getByRole('link', { name: 'Email booking contact', exact: true })).toHaveAttribute('href', /^mailto:/)
    await page.goto('/modeling-gallery')
    await expect(page.locator('main img').first()).toBeVisible()
    await page.goto('/press-kit')
    await expect(page.locator('main a[href$=".pdf"]').first()).toBeVisible()
    await page.goto('/video-gallery')
    await expect(page.getByRole('link', { name: /watch.*youtube|youtube.*watch/i }).first()).toBeVisible()
    for (const route of ['/', '/video-gallery']) {
      await page.goto(route)
      const form = page.getByRole('textbox', { name: 'Email address' }).locator('xpath=ancestor::form[1]')
      await expect(form).toHaveAttribute('action', /^https?:\/\//)
      await expect(form.getByRole('button', { name: /subscribe|continue to signup/i })).toBeVisible()
    }
  })
})

test.describe('M4 raw SEO for newly implemented routes', () => {
  test('serves truthful direct-entry metadata for all six canonical indexable routes', async ({ request }) => {
    const titles = new Set<string>()
    for (const route of indexableRoutes) {
      const raw = await getM4RawPage(request, route)
      expect(raw.status, route).toBe(200)
      const title = raw.body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? ''
      expect(title.length, route).toBeGreaterThan(10)
      expect(titles.has(title), 'duplicate title on ' + route).toBe(false)
      titles.add(title)
      expect(raw.body).toMatch(/<link[^>]+rel=["']canonical["']/i)
      expect(raw.body).toContain(m4FixtureOrigin + route)
      expect(raw.body).toMatch(/<meta[^>]+name=["']description["']/i)
      const robots = htmlTags(raw.body, 'meta').find(
        (tag) => htmlAttribute(tag, 'name')?.toLowerCase() === 'robots',
      )
      expect(normalizeRobotsDirectives(htmlAttribute(robots ?? '', 'content'))).toEqual(
        m4Deployment === 'production' ? ['follow', 'index'] : ['nofollow', 'noindex'],
      )
      expect(raw.body).not.toMatch(/localhost|127\.0\.0\.1/i)
    }
  })

  test('excludes the legacy alias and calendar from indexable sitemap output', async ({ request }) => {
    const alias = await getM4RawPage(request, '/home')
    expect(alias.status).toBe(200)
    expect(alias.body).toContain(m4FixtureOrigin + '/')
    const robots = htmlTags(alias.body, 'meta').find(
      (tag) => htmlAttribute(tag, 'name')?.toLowerCase() === 'robots',
    )
    expect(normalizeRobotsDirectives(htmlAttribute(robots ?? '', 'content'))).toEqual(['nofollow', 'noindex'])
    const calendar = await getM4RawPage(request, '/calendar')
    expect(calendar.status).toBe(404)
    const sitemap = await getM4RawPage(request, '/sitemap.xml')
    expect(sitemap.status).toBe(200)
    for (const route of indexableRoutes) expect(sitemap.body).toContain(m4FixtureOrigin + route)
    expect(sitemap.body).not.toContain(m4FixtureOrigin + '/home')
    expect(sitemap.body).not.toContain(m4FixtureOrigin + '/calendar')
  })
})

test.describe('M4 evidence screenshots', () => {
  test('captures page and interaction evidence for later integrated review', async ({ page }) => {
    const project = test.info().project.name
    for (const route of ['/', '/about', '/booking', '/press-kit', '/modeling-gallery', '/video-gallery']) {
      await page.goto(route)
      const name = route === '/' ? 'home' : route.slice(1).replaceAll('-', '_')
      await page.screenshot({
        path: 'docs/reports/QA-M4/visual/' + project + '-' + name + '.png',
        fullPage: true,
      })
    }
  })
})
