import React, { useEffect, useState, useRef } from 'react';
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
  const [epoca, setEpoca] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [estado, setEstado] = useState(null);
  const [procedencia, setProcedencia] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [autor, setAutor] = useState(null);
  
  const abortController = useRef(new AbortController());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const signal = abortController.current.signal;
        
        // 1. Obtener objeto principal
        const resObjeto = await fetch(`/api/objetos/${id}`, { signal });
        if (!resObjeto.ok) {
          throw new Error('No se pudo obtener el objeto');
        }
        const dataObjeto = await resObjeto.json();
        setObjeto(dataObjeto);
        
        // 2. Crear array de promesas para todas las peticiones
        const requests = [
          // Peticiones que solo dependen del ID
          fetch(`/api/modelos/${id}`, { signal }).catch(e => e),
          fetch(`/api/imagenes/${id}`, { signal }).catch(e => e),
          fetch(`/api/videos/${id}`, { signal }).catch(e => e),
          
          // Peticiones que dependen de IDs del objeto
          ...(dataObjeto.epoca_id 
            ? [fetch(`/api/epocas/${dataObjeto.epoca_id}`, { signal }).catch(e => e)] 
            : []),
          ...(dataObjeto.ubicacion_actual_id 
            ? [fetch(`/api/ubicaciones/${dataObjeto.ubicacion_actual_id}`, { signal }).catch(e => e)] 
            : []),
          ...(dataObjeto.estado_conservacion_id 
            ? [fetch(`/api/estados/${dataObjeto.estado_conservacion_id}`, { signal }).catch(e => e)] 
            : []),
          ...(dataObjeto.procedencia_id 
            ? [fetch(`/api/procedencias/${dataObjeto.procedencia_id}`, { signal }).catch(e => e)] 
            : []),
          ...(dataObjeto.categoria_id 
            ? [fetch(`/api/categorias/${dataObjeto.categoria_id}`, { signal }).catch(e => e)] 
            : []),
          ...(dataObjeto.autor_id 
            ? [fetch(`/api/autores/${dataObjeto.autor_id}`, { signal }).catch(e => e)] 
            : [])
        ];

        // 3. Ejecutar todas las peticiones
        const responses = await Promise.all(requests);
        
        // 4. Procesar respuestas
        let responseIndex = 0;
        
        // Modelo
        if (responses[responseIndex]?.ok) {
          setModelo(await responses[responseIndex].json());
        }
        responseIndex++;
        
        // Imágenes
        if (responses[responseIndex]?.ok) {
          setImagenes(await responses[responseIndex].json());
        }
        responseIndex++;
        
        // Videos
        if (responses[responseIndex]?.ok) {
          setVideos(await responses[responseIndex].json());
        }
        responseIndex++;
        
        // Época
        if (dataObjeto.epoca_id) {
          if (responses[responseIndex]?.ok) {
            setEpoca(await responses[responseIndex].json());
          }
          responseIndex++;
        }
        
        // Ubicación
        if (dataObjeto.ubicacion_actual_id) {
          if (responses[responseIndex]?.ok) {
            setUbicacion(await responses[responseIndex].json());
          }
          responseIndex++;
        }
        
        // Estado de conservación
        if (dataObjeto.estado_conservacion_id) {
          if (responses[responseIndex]?.ok) {
            setEstado(await responses[responseIndex].json());
          }
          responseIndex++;
        }
        
        // Procedencia
        if (dataObjeto.procedencia_id) {
          if (responses[responseIndex]?.ok) {
            setProcedencia(await responses[responseIndex].json());
          }
          responseIndex++;
        }
        
        // Categoría
        if (dataObjeto.categoria_id) {
          if (responses[responseIndex]?.ok) {
            setCategoria(await responses[responseIndex].json());
          }
          responseIndex++;
        }
        
        // Autor
        if (dataObjeto.autor_id) {
          if (responses[responseIndex]?.ok) {
            setAutor(await responses[responseIndex].json());
          }
          responseIndex++;
        }

      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error al cargar los datos:', err);
        }
      }
    };

    fetchData();

    return () => {
      abortController.current.abort();
      abortController.current = new AbortController();
    };
  }, [id]);




  if (!objeto) {
    return <div className="text-white p-6">Cargando objeto...</div>;
  }

  return (
    <div className="pt-18 px-2 sm:px-9">

      
      {/* Modelo 3D */}
      {modelo?.ruta_modelo && (
        
          <div className="invert-trigger pb-16 ">
            <Modelo3D 
              ruta={modelo.ruta_modelo} 
              fondo={modelo.ruta_fondo} 
            />
          </div>
    
      )}

      {/* Imágenes */}
      {imagenes.length > 0 && (
      <div className=" pb-16 ">
          <Imagenes imagenes={imagenes} />
      </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
      <div className="invert-trigger pb-16 ">
          <Videos videos={videos} />
      </div>
      )}

<div>
  <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest mb-6">
    {objeto.nombre}
  </h1>

  <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
    <section>
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
        Información Básica
      </h2>
      <p className="flex flex-wrap">
        <span className="font-medium w-40">Descripción:</span>
        <span>{objeto.descripcion}</span>
      </p>
      <p className="flex flex-wrap">
        <span className="font-medium w-40">Fecha de creación:</span>
        <span>{new Date(objeto.fecha_creacion).toLocaleDateString()}</span>
      </p>
      <p className="flex flex-wrap">
        <span className="font-medium w-40">Valor histórico:</span>
        <span>{objeto.valor_historico}</span>
      </p>
    </section>

    {epoca && (
      <section>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
          Época
        </h2>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">Nombre:</span>
          <span>{epoca.nombre_epoca}</span>
        </p>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">Periodo:</span>
          <span>
            {epoca.ano_inicio} - {epoca.ano_fin}
          </span>
        </p>
      </section>
    )}

    {ubicacion && (
      <section>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
          Ubicación Actual
        </h2>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">País:</span>
          <span>{ubicacion.pais}</span>
        </p>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">Museo/Institución:</span>
          <span>{ubicacion.museo}</span>
        </p>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">Contacto:</span>
          <span>{ubicacion.contacto}</span>
        </p>
      </section>
    )}

    {estado && (
      <section>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
          Conservación
        </h2>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">Estado:</span>
          <span>{estado.estado}</span>
        </p>
      </section>
    )}

    {procedencia && (
      <section>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
          Procedencia
        </h2>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">Región:</span>
          <span>{procedencia.nombre_region}</span>
        </p>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">Detalles:</span>
          <span>{procedencia.descripcion}</span>
        </p>
      </section>
    )}

    {categoria && (
      <section>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
          Categoría
        </h2>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">Tipo:</span>
          <span>{categoria.categoria}</span>
        </p>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">Descripción:</span>
          <span>{categoria.descripcion}</span>
        </p>
      </section>
    )}

    {autor && (
      <section>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
          Autor
        </h2>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">Nombre:</span>
          <span>{autor.nombre}</span>
        </p>
        <p className="flex flex-wrap">
          <span className="font-medium w-40">Referencia:</span>
          <a 
            href={autor.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {autor.url}
          </a>
        </p>
      </section>
    )}
  </div>
</div>
    </div>

   
  );
};

export default React.memo(ObjetoPage);