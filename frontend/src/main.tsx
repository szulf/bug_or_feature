import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Provider from './components/Provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
    <App />
    </Provider>
  </StrictMode>,
)
