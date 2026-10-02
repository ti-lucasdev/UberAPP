import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './design.css'
import './brand.css'
import './viewport.css'
import './ambient.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
