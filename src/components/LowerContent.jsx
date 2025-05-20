import React, { useState, useEffect } from 'react';
import Modelo3D from '../components/3Dmodel';
import Imagenes from '../components/Images';
import Videos from '../components/Videos';

const mediaDescriptions = {
  modelo: "Explora nuestros modelos 3D interactivos que te permiten visualizar y manipular digitalmente las piezas desde todos los ángulos. Gira, acerca y examina los detalles con control total.",
  imagenes: "Galería fotográfica de alta resolución que documenta piezas históricas y culturales. Capturas profesionales con iluminación controlada para apreciar texturas y detalles.",
  videos: "Material audiovisual documental que muestra procesos de restauración, contextos históricos y análisis expertos de las piezas museísticas."
};

const LowerContent = () => {
  const [objeto, setObjeto] = useState(null);
  const [modelo, setModelo] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchDatos = async () => {
      const controller = new AbortController();
      const { signal } = controller;

      const fetchData = async (url) => {
        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
      };

      try {
        const [dataObjeto, dataModelo, dataImagenes, dataVideos] = await Promise.all([
          fetchData('/api/objetos/1'),
          fetch('/api/modelos/1').then(res => res.ok ? res.json() : null),
          fetch('/api/imagenes/1').then(res => res.ok ? res.json() : []),
          fetch('/api/videos/1').then(res => res.ok ? res.json() : []),
        ]);

        setObjeto(dataObjeto);
        setModelo(dataModelo);
        setImagenes(dataImagenes);
        setVideos(dataVideos);

      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error:', err);
        }
      }
    };

    fetchDatos();
  }, []);

  return (
    <div className="relative z-20 min-h-screen p-8">
      <style jsx>{`
        @keyframes fadeInBlur {
          0% {
            opacity: 0;
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            filter: blur(0);
          }
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-blur {
          animation: fadeInBlur 1s ease-out forwards;
        }

        .animate-slide-in {
          animation: slideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {/* Texto introductorio con animación */}
      <p className={`text-4xl text-gray-900 leading-tight mb-16 max-w-5xl 
        ${isMounted ? 'animate-fade-in-blur' : 'opacity-0 blur-sm'}`}>
        Esta galería interactiva presenta objetos de museos relacionados con Bolivia,
        incluyendo imágenes, videos y modelos 3D que puedes explorar libremente.
      </p>

      <div className="max-w-6xl mx-auto text-gray-800 space-y-20">

        {/* Sección Modelo 3D */}
        {modelo?.ruta_modelo && (
          <section className={`flex flex-col md:flex-row gap-12 items-start pb-16 
            ${isMounted ? 'animate-slide-in' : 'opacity-0'}`}>
            <div className="w-full md:w-2/3 rounded-3xl overflow-hidden  h-[500px] 
              transition-all duration-700 delay-200">
              <Modelo3D 
                ruta={modelo.ruta_modelo} 
                fondo={modelo.ruta_fondo}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="w-full md:w-1/3 space-y-6 pt-2 
              transition-all duration-700 delay-300">
              <h2 className="text-4xl font-bold text-gray-800">Modelo 3D</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {mediaDescriptions.modelo}
              </p>
              {modelo.descripcion && (
                <p className="text-gray-500 text-sm italic mt-6 border-l-4 border-gray-300 pl-4">
                  {modelo.descripcion}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Sección Imágenes */}
        {imagenes.length > 0 && (
          <section className={`flex flex-col md:flex-row-reverse gap-12 items-start pb-16 
            ${isMounted ? 'animate-slide-in' : 'opacity-0'}`}>
            <div className="w-full md:w-2/3 transition-all duration-700 delay-300">
              
                <Imagenes 
                  imagenes={imagenes}
                  className="shadow-lg h-64 w-full object-cover 
                    transition-transform duration-300 hover:scale-105"
                />
              
            </div>
            
            <div className="w-full md:w-1/3 space-y-6 pt-2 
              transition-all duration-700 delay-200">
              <h2 className="text-4xl font-bold text-gray-800">Galería Fotográfica</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {mediaDescriptions.imagenes}
              </p>
            </div>
          </section>
        )}

        {/* Sección Videos */}
        {videos.length > 0 && (
          <section className={`flex flex-col md:flex-row gap-12 items-start pb-16 
            ${isMounted ? 'animate-slide-in' : 'opacity-0'}`}>
            <div className="w-full md:w-2/3 transition-all duration-700 delay-300">
              <Videos 
                videos={videos}
                className="shadow-lg h-64 w-full object-cover 
                    transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            <div className="w-full md:w-1/3 space-y-6 pt-2 
              transition-all duration-700 delay-300">
              <h2 className="text-4xl font-bold text-gray-800">Documentales</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {mediaDescriptions.videos}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LowerContent;