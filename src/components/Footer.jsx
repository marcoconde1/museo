import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-black backdrop-blur-sm py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center">
         
          
          {/* Derechos de autor */}
          <p className="text-gray-100 text-sm text-center">
            © {currentYear} Galería Interactiva de Museos de Bolivia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;