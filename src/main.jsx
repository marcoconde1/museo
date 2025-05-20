import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/AppRouter';
import './index.css'; // Importa Tailwind CSS
// En tu App.jsx o index.js
import '@fontsource/poppins'; // Peso por defecto (400)
import '@fontsource/poppins/700.css'; // Para peso 700

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
