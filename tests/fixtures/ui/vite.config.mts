import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const port = Number(process.env.QA_FIXTURE_PORT ?? 3114)

export default defineConfig({
  root: path.resolve(root, 'tests/fixtures/ui'),
  resolve: {
    alias: {
      '@/components': path.resolve(root, 'components'),
      '@/templates': path.resolve(root, 'components/templates'),
      '@/public': path.resolve(root, 'public'),
      '@/assets': path.resolve(root, 'public/assets'),
      lib: path.resolve(root, 'lib'),
      '@': root,
    },
  },
  publicDir: path.resolve(root, 'public'),
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client'],
  },
  css: {
    postcss: path.resolve(root, 'tests/fixtures/ui/postcss.config.cjs'),
  },
  server: {
    host: '127.0.0.1',
    port,
    strictPort: true,
  },
})
