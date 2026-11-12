import { generateKeyPairSync } from 'node:crypto'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const preload = path.join(root, 'tests/helpers/calendar-provider-preload.cjs')
const cli = path.join(root, 'node_modules/@playwright/test/cli.js')
const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
})
const options = `--require=${JSON.stringify(preload)}`
const nodeOptions = [process.env.NODE_OPTIONS, options].filter(Boolean).join(' ')

const scenarios = [
  ['ready', 'tests/e2e/modernization-event-ready.spec.ts'],
  ['empty', 'tests/e2e/modernization-event-empty.spec.ts'],
  ['unavailable', 'tests/e2e/modernization-event-unavailable.spec.ts'],
].filter(([name]) => {
  const selected = process.env.CALENDAR_QA_SCENARIOS
  return !selected || selected.split(',').map((value) => value.trim()).includes(name)
})

if (scenarios.length === 0) {
  throw new Error('CALENDAR_QA_SCENARIOS did not select a supported fixture scenario')
}

for (const [scenario, spec] of scenarios) {
  const child = spawn(process.execPath, [cli, 'test', spec], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      RUN_MODERNIZATION: '1',
      CALENDAR_QA_SCENARIO: scenario,
      GOOGLE_CALENDAR_ID: 'qa-calendar@qa.invalid',
      GOOGLE_APPLICATION_CREDENTIALS: '',
      GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({
        type: 'service_account',
        client_email: 'synthetic-qa-service-account@qa.invalid',
        private_key: privateKey,
      }),
      GOOGLE_CALENDAR_REFRESH_SECONDS: '1',
      NODE_OPTIONS: nodeOptions,
      NEXT_PUBLIC_SITE_URL: 'https://qa.invalid',
      NEXT_PUBLIC_DEPLOYMENT_ENV: 'production',
    },
  })

  const code = await new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (exitCode, signal) => {
      if (signal) reject(new Error(`Playwright ${scenario} run stopped by ${signal}`))
      else resolve(exitCode ?? 1)
    })
  })
  if (code !== 0) process.exit(code)
}
