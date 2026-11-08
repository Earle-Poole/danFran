import { createRequire } from 'node:module'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSeoMetadata } from '../../../lib/seo/metadata'
import { getConfiguredOrigin } from '../../../lib/seo/origin'

const requireFromTest = createRequire(import.meta.url)
const configPath = path.resolve(process.cwd(), 'next.config.js')
const configId = requireFromTest.resolve(configPath)

function loadNextConfig(environment: Record<string, string | undefined>): unknown {
  for (const name of ['VERCEL_ENV', 'NEXT_PUBLIC_DEPLOYMENT_ENV', 'NEXT_PUBLIC_SITE_URL']) {
    vi.stubEnv(name, environment[name] ?? '')
  }
  delete requireFromTest.cache[configId]
  try {
    return requireFromTest(configPath)
  } finally {
    delete requireFromTest.cache[configId]
  }
}

afterEach(() => {
  vi.unstubAllEnvs()
  delete requireFromTest.cache[configId]
})

describe('Vercel production configuration origin guard', () => {
  it('accepts a configured public HTTPS origin only with explicit production mode', () => {
    expect(loadNextConfig({
      VERCEL_ENV: 'production',
      NEXT_PUBLIC_DEPLOYMENT_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://danfran.com',
    })).toBeDefined()
  })

  it('rejects missing, malformed, private, local, and placeholder production origins', () => {
    const invalidOrigins: Array<string | undefined> = [
      undefined,
      '',
      'not a URL',
      'http://danfran.com',
      'https://danfran.com/path',
      'https://danfran.com?campaign=qa',
      'https://user:password@danfran.com',
      'https://localhost',
      'https://localhost.',
      'https://127.0.0.1',
      'https://192.168.1.20',
      'https://[::1]',
      'https://[2001:db8::1]',
      'https://intranet',
      'https://danfran.local',
      'https://danfran.internal',
      'https://example.com',
      'https://preview.example.org',
      'https://danfran.invalid',
      'https://danfran.test',
      'https://danfran.example',
    ]

    for (const origin of invalidOrigins) {
      expect(
        () => loadNextConfig({
          VERCEL_ENV: 'production',
          NEXT_PUBLIC_DEPLOYMENT_ENV: 'production',
          NEXT_PUBLIC_SITE_URL: origin,
        }),
        `expected Vercel production to reject ${origin ?? '(missing origin)'}`,
      ).toThrow(/real public HTTPS origin/i)
    }
  })

  it('requires explicit production deployment mode on Vercel production', () => {
    expect(() => loadNextConfig({
      VERCEL_ENV: 'production',
      NEXT_PUBLIC_DEPLOYMENT_ENV: 'preview',
      NEXT_PUBLIC_SITE_URL: 'https://danfran.com',
    })).toThrow(/NEXT_PUBLIC_DEPLOYMENT_ENV=production/i)
  })

  it('keeps local QA production fixtures usable when VERCEL_ENV is absent', () => {
    expect(loadNextConfig({
      VERCEL_ENV: undefined,
      NEXT_PUBLIC_DEPLOYMENT_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://qa.invalid',
    })).toBeDefined()
    expect(getConfiguredOrigin({ value: 'https://qa.invalid', environment: 'production' })).toBe('https://qa.invalid')
  })

  it('allows Vercel previews without inventing a public origin and keeps their pages noindex', () => {
    expect(loadNextConfig({
      VERCEL_ENV: 'preview',
      NEXT_PUBLIC_DEPLOYMENT_ENV: 'preview',
      NEXT_PUBLIC_SITE_URL: undefined,
    })).toBeDefined()
    expect(getConfiguredOrigin()).toBeNull()
    const metadata = createSeoMetadata({ routeId: 'home' })
    expect(metadata.indexable).toBe(false)
    expect(metadata.robots).toBe('noindex,nofollow')
    expect(metadata.canonicalUrl).toBeNull()
  })
})
