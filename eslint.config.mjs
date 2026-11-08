import nextVitals from 'eslint-config-next/core-web-vitals'
import { globalIgnores } from 'eslint/config'

const config = [
  globalIgnores([
    'playwright-report/**',
    'test-results/**',
    'coverage/**',
    '.qa-output/**',
  ]),
  ...nextVitals,
]

export default config
