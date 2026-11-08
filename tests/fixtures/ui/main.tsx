import '../../../styles/globals.css'
import type { ComponentType } from 'react'
import { createRoot } from 'react-dom/client'

type ShowcaseModule = {
  default?: ComponentType
  PrimitiveShowcase?: ComponentType
}

const modules = import.meta.glob(
  '../../integration/ui/fixtures/PrimitiveShowcase.tsx',
  { eager: true }
  ) as Record<string, ShowcaseModule>
const showcaseModule = Object.values(modules)[0]
const Showcase = showcaseModule?.default ?? showcaseModule?.PrimitiveShowcase

function MissingShowcase() {
  return (
    <main>
      <h1>UI primitive showcase pending</h1>
      <p>
        The renderer is ready for the UI worker&apos;s test-only
        PrimitiveShowcase fixture.
      </p>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  Showcase ? <Showcase /> : <MissingShowcase />
)
