import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent external browser extension errors (e.g. MetaMask, web3 injections) from bubbling up as unhandled rejections
window.addEventListener('unhandledrejection', (event) => {
  const reason = String(event.reason?.message || event.reason || '');
  if (
    reason.includes('MetaMask') ||
    reason.includes('ethereum') ||
    reason.includes('WebSocket') ||
    reason.includes('websocket')
  ) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  const msg = String(event.message || '');
  if (
    msg.includes('MetaMask') ||
    msg.includes('ethereum') ||
    msg.includes('WebSocket') ||
    msg.includes('websocket')
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
