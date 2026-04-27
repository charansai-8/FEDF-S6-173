import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import Parent2 from './components/Parent2.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*<App />} */}
    <Parent2 />
  </StrictMode>,
)
