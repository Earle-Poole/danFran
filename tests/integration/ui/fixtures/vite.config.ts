import path from 'node:path'
import { defineConfig } from 'vite'

const repositoryRoot = path.resolve(__dirname, '../../../..')

export default defineConfig({
  root: __dirname,
  publicDir: path.join(repositoryRoot, 'public'),
  server: {
    fs: {
      allow: [repositoryRoot],
    },
  },
})
