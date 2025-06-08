// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Gallery from '../pages/Gallery';
import ObjectPage from '../pages/ObjectPage';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CreateObject from '../components/components_administrator/CreateObject';
import EditObject from '../components/components_administrator/EditObject';
import Navbar from '../components/Navbar';
import Background from '../components/Background';
import Favorites from '../pages/Saved';
import Footer from '../components/Footer'; // Importar el nuevo componente Footer

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <Background />
        <Navbar />
        <div className="min-h-screen"> {/* Contenedor para el contenido principal */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/object/:id" element={<ObjectPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/createObject" element={<CreateObject />} />
            <Route path="/editObject/:id" element={<EditObject />} />
            <Route path="/saved" element={<Favorites />} />
          </Routes>
        </div>
        <Footer /> {/* Footer agregado aquí - aparecerá en todas las páginas */}
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;