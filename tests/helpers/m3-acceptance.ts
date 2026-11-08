import { expect, type APIRequestContext } from '@playwright/test'

export const m3AcceptanceEnabled = process.env.RUN_M3_ACCEPTANCE === '1'
export const m3FixtureOrigin = process.env.M3_SITE_ORIGIN ?? 'https://qa.invalid'

export type RawPage = {
  body: string
  headers: Record<string, string>
  status: number
}

export async function getRawPage(
  request: APIRequestContext,
  pathname: string,
): Promise<RawPage> {
  const response = await request.get(pathname)
  return {
    body: await response.text(),
    headers: response.headers(),
    status: response.status(),
  }
}

export async function getClientJavaScriptBundles(
  request: APIRequestContext,
  rawHtml: string,
): Promise<Array<{ src: string; body: string }>> {
  const bundlePaths = htmlTags(rawHtml, 'script')
    .map((tag) => htmlAttribute(tag, 'src'))
    .filter((src): src is string => Boolean(src && src.includes('/_next/static/') && /\.js(?:\?|$)/i.test(src)))
  const uniquePaths = Array.from(new Set(bundlePaths))
  const fallbackPort = process.env.PLAYWRIGHT_PORT ?? (process.env.RUN_CALENDAR_ACCEPTANCE === '1' ? '3181' : '3113')
  const fallbackOrigin = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${fallbackPort}`
  return Promise.all(uniquePaths.map(async (src) => {
    const response = await request.get(new URL(src, fallbackOrigin).href)
    expect(response.ok(), `client bundle ${src} should load`).toBe(true)
    return { src, body: await response.text() }
  }))
}

export function htmlTags(html: string, tagName: string): string[] {
  return Array.from(html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))).map(
    ([tag]) => tag,
  )
}

export function htmlAttribute(tag: string, attribute: string): string | undefined {
  return tag.match(new RegExp(`${attribute}\\s*=\\s*["']([^"']*)`, 'i'))?.[1]
}

export function htmlText(html: string, tagName: string): string[] {
  return Array.from(
    html.matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)</${tagName}>`, 'gi')),
  ).map(([, text]) => text.trim())
}

export function canonicalPath(pathname: string): string {
  return pathname === '/home' ? '/' : pathname
}
