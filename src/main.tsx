
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Uygulamayı başlat
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element bulunamadı!");
} else {
  createRoot(rootElement).render(<App />);
  console.log("Uygulama başlatıldı");
}
