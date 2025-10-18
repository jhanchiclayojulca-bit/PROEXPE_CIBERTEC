import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 🔹 Importante para que Tailwind funcione

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
