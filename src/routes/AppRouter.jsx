// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gallery from '../pages/Gallery';  // Asegúrate de tener la ruta correcta para el componente Gallery
import ObjectPage from '../pages/ObjectPage';  // Asegúrate de tener la ruta correcta para ObjectPage
import Home from '../pages/Home'; // <-- no olvides importarlo

import Navbar from '../components/Navbar'; // <-- importa el navbar
import Background from '../components/Background'; // Importa el nuevo componente Background

const AppRouter = () => {
  return (
    <Router>
      {/* Background envuelve toda la aplicación */}
      <Background dotCount={80} dotRadius={25}></Background>
       <Navbar /> {/* Aquí se renderiza el Navbar una sola vez */}
      <Routes>
        {/* Ruta principal que muestra la galería */}
        <Route path="/" element={<Home />} />
        {/* Ruta principal que muestra la galería */}
        <Route path="/gallery" element={<Gallery />} />
        {/* Ruta para cada objeto individual */}
        <Route path="/object/:id" element={<ObjectPage />} />


   
      </Routes>
    </Router>
  );
};

export default AppRouter;
