import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

const calendarAcceptanceEnabled = process.env.RUN_CALENDAR_ACCEPTANCE === '1'
const appPort = Number(process.env.PLAYWRIGHT_PORT ?? (calendarAcceptanceEnabled ? 3181 : 3113))
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${appPort}`
const usesExternalServer = Boolean(process.env.PLAYWRIGHT_BASE_URL)
const productionServerEnabled = process.env.PLAYWRIGHT_PRODUCTION_SERVER === '1'
const uiPort = Number(process.env.QA_FIXTURE_PORT ?? 3114)
const uiBaseURL = process.env.PLAYWRIGHT_UI_BASE_URL ?? `http://127.0.0.1:${uiPort}`
const usesExternalUI = Boolean(process.env.PLAYWRIGHT_UI_BASE_URL)
const m4AcceptanceEnabled = process.env.RUN_M4_ACCEPTANCE === '1'
const m4Ignore = m4AcceptanceEnabled ? [] : ['**/m4-feature-acceptance*.spec.ts']
const m5AcceptanceEnabled = process.env.RUN_M5_ACCEPTANCE === '1'
const m5Ignore = m5AcceptanceEnabled ? [] : ['**/m5-feature-acceptance*.spec.ts']
const modernizationEnabled = process.env.RUN_MODERNIZATION === '1'
const modernizationIgnore = modernizationEnabled ? [] : ['**/modernization-event-*.spec.ts']
const installedChrome = [
  process.env.PLAYWRIGHT_EXECUTABLE_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
]
  .filter((candidate): candidate is string => Boolean(candidate))
  .find((candidate) => existsSync(candidate))
const browserOverride =
  !process.env.CI && process.env.PLAYWRIGHT_CHANNEL === 'chrome'
    ? { channel: 'chrome' as const }
    : !process.env.CI && process.env.PLAYWRIGHT_EXECUTABLE_PATH && installedChrome
      ? { launchOptions: { executablePath: installedChrome } }
      : {}

const desktopChrome = {
  ...devices['Desktop Chrome'],
  viewport: { width: 1440, height: 900 },
  ...browserOverride,
}

const compactChrome = {
  ...devices['Desktop Chrome'],
  viewport: { width: 390, height: 844 },
  ...browserOverride,
}

const appWebServer = {
  command: `corepack yarn ${productionServerEnabled ? 'start' : 'dev'} -p ${appPort} -H 127.0.0.1`,
  // The home page can correctly return 500 when the synthetic provider is
  // unavailable. Use an independent health route so that this is still a
  // ready production server, not a failed server startup.
  url: `${baseURL}${productionServerEnabled ? '/robots.txt' : '/'}`,
  // Production runs must own the server process to avoid accidentally
  // accepting a pre-existing development server on the same port.
  reuseExistingServer: productionServerEnabled ? false : process.env.PLAYWRIGHT_REUSE_SERVER === '1',
  timeout: 120_000,
  stdout: 'pipe' as const,
  stderr: 'pipe' as const,
  ...(calendarAcceptanceEnabled
    ? {
        env: {
          GOOGLE_CALENDAR_ID: '',
          GOOGLE_APPLICATION_CREDENTIALS: '',
          GOOGLE_SERVICE_ACCOUNT_JSON: '',
        },
      }
    : {}),
}

const uiWebServer = {
  command: `corepack yarn vite --config tests/fixtures/ui/vite.config.mts --host 127.0.0.1 --port ${uiPort}`,
  url: `${uiBaseURL}/`,
  reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === '1',
  timeout: 120_000,
  stdout: 'pipe' as const,
  stderr: 'pipe' as const,
}

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Keep one worker against the single local Next server so route navigation
  // and server fixture state remain deterministic in both dev and production.
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'en-US',
  },
  projects: [
    {
      name: 'desktop-chrome',
      testIgnore: [
        '**/ui-primitives.spec.ts',
        '**/m3-shell-seo.compact.spec.ts',
        '**/m4-feature-acceptance.compact.spec.ts',
        ...m4Ignore,
        '**/m5-feature-acceptance.compact.spec.ts',
        ...m5Ignore,
        ...modernizationIgnore,
      ],
      use: desktopChrome,
    },
    {
      name: 'compact-chrome',
      testIgnore: [
        '**/ui-primitives.spec.ts',
        '**/m3-shell-seo.spec.ts',
        '**/m4-feature-acceptance.spec.ts',
        '**/m5-feature-acceptance.spec.ts',
        ...m4Ignore,
        ...m5Ignore,
        ...modernizationIgnore,
      ],
      use: compactChrome,
    },
    {
      name: 'ui-fixture-chrome',
      testMatch: '**/ui-primitives.spec.ts',
      use: {
        ...desktopChrome,
        baseURL: uiBaseURL,
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: [
    ...(usesExternalServer ? [] : [appWebServer]),
    ...(usesExternalUI ? [] : [uiWebServer]),
  ],
})
