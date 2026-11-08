const path = require('node:path')

const root = path.resolve(__dirname, '../../../')

module.exports = {
  content: [
    path.join(root, 'components/**/*.{js,ts,jsx,tsx}'),
    path.join(root, 'tests/fixtures/ui/**/*.{js,ts,jsx,tsx,html}'),
    path.join(root, 'tests/integration/ui/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
