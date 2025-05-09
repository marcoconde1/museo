import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GaleriaObjetos = () => {
  const [objetos, setObjetos] = useState([]);

  useEffect(() => {
    const fetchObjetos = async () => {
      try {
        const res = await fetch('/api/objetos');
        const data = await res.json();
        console.log('Objetos:', data);  
        setObjetos(data);
      } catch (error) {
        console.error('Error al cargar objetos:', error);
      }
    };

    fetchObjetos();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Galería de Objetos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {objetos.map((objeto) => (
          <Link
            to={`/object/${objeto.id}`}
            key={objeto.id}
            className="bg-gray-800 rounded shadow hover:scale-105 transition-transform duration-200"
          >
            <img
              src={objeto.ruta_preview}
              alt={objeto.nombre}
              className="w-full h-48 object-cover rounded-t"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{objeto.nombre}</h2>
              <p className="text-sm text-gray-300 truncate">{objeto.descripcion}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};



export default GaleriaObjetos;

