import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from './contexts/ThemeContext'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </GoogleOAuthProvider>
);
