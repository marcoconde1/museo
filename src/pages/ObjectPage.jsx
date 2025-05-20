import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modelo3D from '../components/3Dmodel';
import Imagenes from '../components/Images';
import Videos from '../components/Videos';


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
        <div className="mb-8 invert-trigger"> {/* Clase agregada aquí */}
          <h1>Modelo 3D</h1>
          <Modelo3D ruta={modelo.ruta_modelo} fondo={modelo.ruta_fondo} />
        </div>
      )}

      {/* Imágenes */}
      {imagenes.length > 0 && (
        <div>
          <h1>Imágenes</h1>
          <Imagenes imagenes={imagenes} />
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div>
          <h1>Videos</h1>
          <Videos videos={videos} />
        </div>
      )}
    </div>
  );
};

export default ObjetoPage;
