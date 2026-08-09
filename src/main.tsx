import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent external browser extension errors (e.g. MetaMask, web3 injections) from bubbling up as unhandled rejections
const shouldSuppress = (reason: unknown) => {
  if (!reason) return false;
  const str = typeof reason === 'string' ? reason : ((reason as { message?: string; stack?: string })?.message || (reason as { stack?: string })?.stack || String(reason));
  return /MetaMask|ethereum|web3|WebSocket|websocket|restoring session|Failed to connect/i.test(str);
};

window.addEventListener('unhandledrejection', (event) => {
  if (shouldSuppress(event.reason)) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
}, true);

window.addEventListener('error', (event) => {
  if (shouldSuppress(event.message || event.error)) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
}, true);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
