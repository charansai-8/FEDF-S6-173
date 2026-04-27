import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Welcome from './components/Welcome.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*<App />} */}
    <Welcome></Welcome>
  </StrictMode>,

)
