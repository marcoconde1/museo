import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modelo3D from '../components/3Dmodel';

const ObjetoPage = () => {
  const { id } = useParams();
  const [objeto, setObjeto] = useState(null);
  const [modelo, setModelo] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // Obtener objeto
        const resObjeto = await fetch(`/api/objetos/${id}`);
        const dataObjeto = await resObjeto.json();
        setObjeto(dataObjeto);

        // Obtener modelo si existe
        const resModelo = await fetch(`/api/modelos/${id}`);
        if (resModelo.ok) {
          const dataModelo = await resModelo.json();
          setModelo(dataModelo);
        }

        // Obtener imágenes si hay
        const resImagenes = await fetch(`/api/imagenes/${id}`);
        if (resImagenes.ok) {
          const dataImagenes = await resImagenes.json();
          setImagenes(dataImagenes);
        }

        // Obtener videos si hay
        const resVideos = await fetch(`/api/videos/${id}`);
        if (resVideos.ok) {
          const dataVideos = await resVideos.json();
          setVideos(dataVideos);
        }

      } catch (err) {
        console.error('Error al cargar los datos:', err);
      }
    };

    fetchDatos();
  }, [id]);

  if (!objeto) return <div className="text-white">Cargando objeto...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">{objeto.nombre}</h1>
      <p className="mb-2"><strong>Descripción:</strong> {objeto.descripcion}</p>
      <p className="mb-2"><strong>Fecha de creación:</strong> {new Date(objeto.fecha_creacion).toLocaleDateString()}</p>
      <p className="mb-2"><strong>Valor histórico:</strong> {objeto.valor_historico}</p>
      <p className="mb-4"><strong>Visitas:</strong> {objeto.nro_visitas}</p>

      {/* Modelo 3D */}
      {modelo?.ruta_modelo && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Modelo 3D</h2>
          <Modelo3D ruta={modelo.ruta_modelo} fondo={modelo.ruta_fondo} />
        </div>
      )}

      {/* Imágenes */}
      {imagenes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Imágenes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imagenes.map((img, index) => (
              <img
                key={index}
                src={img.ruta_imagen}
                alt={`Imagen ${index + 1}`}
                className="w-full rounded shadow"
              />
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((vid, index) => {
                // Obtener el ID del video de YouTube de la URL
                const videoId = vid.ruta_video.split('v=')[1]?.split('&')[0];

                return (
                <div key={index} className="w-full rounded shadow">
                    <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`Video ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    ></iframe>
                </div>
                );
            })}
            </div>
        </div>
        )}
    </div>
  );
};

export default ObjetoPage;
