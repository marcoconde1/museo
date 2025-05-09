// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gallery from '../pages/Gallery';  // Asegúrate de tener la ruta correcta para el componente Gallery
import ObjectPage from '../pages/ObjectPage';  // Asegúrate de tener la ruta correcta para ObjectPage

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta principal que muestra la galería */}
        <Route path="/gallery" element={<Gallery />} />
        {/* Ruta para cada objeto individual */}
        <Route path="/object/:id" element={<ObjectPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
