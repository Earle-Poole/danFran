export const providerFixtures = {
  success: {
    status: 200,
    body: JSON.stringify({ ok: true, source: 'qa-fixture' }),
  },
  failure: {
    status: 503,
    body: JSON.stringify({ error: 'qa-fixture-provider-failure' }),
  },
} as const

export type ProviderFixtureState = keyof typeof providerFixtures
