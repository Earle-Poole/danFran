import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PrimitiveShowcase from './PrimitiveShowcase'
import '../../../../styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimitiveShowcase />
  </StrictMode>,
)
