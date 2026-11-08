import { defineConfig } from 'vitest/config'
import path from 'node:path'

const root = process.cwd()

export default defineConfig({
  resolve: {
    alias: {
      '@/components': path.resolve(root, 'components'),
      '@/templates': path.resolve(root, 'components/templates'),
      '@/public': path.resolve(root, 'public'),
      '@/assets': path.resolve(root, 'public/assets'),
      lib: path.resolve(root, 'lib'),
      'server-only': path.resolve(root, 'node_modules/next/dist/compiled/server-only/empty.js'),
      '@': root,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'tests/e2e/**'],
    clearMocks: true,
    restoreMocks: true,
    passWithNoTests: false,
  },
})
