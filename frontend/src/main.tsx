import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'
import './design.css'
import './brand.css'
import './viewport.css'
import './ambient.css'
import './auth.css'
import './product.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
)
