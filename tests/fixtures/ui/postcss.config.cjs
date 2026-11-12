const autoprefixer = require('autoprefixer')
const path = require('node:path')
const tailwindcss = require('tailwindcss')

module.exports = {
  plugins: [
    tailwindcss({ config: path.resolve(__dirname, 'tailwind.config.cjs') }),
    autoprefixer,
  ],
}
