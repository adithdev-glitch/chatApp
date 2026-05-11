import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/userContext.jsx'
import { MsgProvider } from './context/msgContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <MsgProvider>
      <App />
      </MsgProvider>  
    </UserProvider>
  </StrictMode>
)
