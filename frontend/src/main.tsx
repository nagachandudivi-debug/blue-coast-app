import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { MenuDataProvider } from './context/MenuDataContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <MenuDataProvider>
          <App />
        </MenuDataProvider>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)
