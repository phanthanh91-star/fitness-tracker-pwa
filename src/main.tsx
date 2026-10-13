import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Đăng ký Service Worker hỗ trợ chạy Offline và tính năng PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('FitTrack PWA Service Worker đã đăng ký thành công:', registration.scope);
      })
      .catch((error) => {
        console.error('Đăng ký Service Worker thất bại:', error);
      });
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
