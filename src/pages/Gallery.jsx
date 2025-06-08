// src/pages/GaleriaObjetos.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GaleriaObjetos = () => {
  const [objetos, setObjetos] = useState([]);
  const [filtros, setFiltros] = useState({
    epocas: [],
    categorias: [],
    procedencias: [],
    estados: [],
    ubicaciones: [],
  });
  const [guardados, setGuardados] = useState([]); // Nuevo estado para objetos guardados
  const [loadingGuardados, setLoadingGuardados] = useState(false); // Carga de guardados

  const [filtro, setFiltro] = useState({
    nombre: '',
    epoca: '',
    categoria: '',
    procedencia: '',
    estado: '',
    ubicacion: '',
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user && user.admin;

  // Cargar objetos, filtros y objetos guardados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resObjetos, resEpocas, resCategorias, resProcedencias, resEstados, resUbicaciones] = await Promise.all([
          fetch('/api/objetos'),
          fetch('/api/epocas'),
          fetch('/api/categorias'),
          fetch('/api/procedencias'),
          fetch('/api/estados'),
          fetch('/api/ubicaciones'),
        ]);

        const [objetosData, epocas, categorias, procedencias, estados, ubicaciones] = await Promise.all([
          resObjetos.json(),
          resEpocas.json(),
          resCategorias.json(),
          resProcedencias.json(),
          resEstados.json(),
          resUbicaciones.json(),
        ]);

        setObjetos(objetosData);
        setFiltros({ epocas, categorias, procedencias, estados, ubicaciones });
        
        // Cargar objetos guardados si hay usuario autenticado
        if (user) {
          setLoadingGuardados(true);
          const resGuardados = await fetch(`/api/favoritos/usuario/${user.id}`);
          const guardadosData = await resGuardados.json();
          setGuardados(guardadosData.map(fav => fav.objeto_id));
          setLoadingGuardados(false);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltro({
      nombre: '',
      epoca: '',
      categoria: '',
      procedencia: '',
      estado: '',
      ubicacion: '',
    });
  };

  // Función para guardar un objeto
  const guardarObjeto = async (objetoId) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/favoritos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuario_id: user.id,
          objeto_id: objetoId
        })
      });

      if (response.ok) {
        // Agregar a la lista de guardados
        setGuardados(prev => [...prev, objetoId]);
      } else {
        const errorData = await response.json();
        console.error('Error al guardar objeto:', errorData.message);
        alert('No se pudo guardar el objeto');
      }
    } catch (error) {
      console.error('Error al guardar objeto:', error);
      alert('Error de conexión al intentar guardar el objeto');
    }
  };

  // Función para eliminar un objeto guardado
  const eliminarGuardado = async (objetoId) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/favoritos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuario_id: user.id,
          objeto_id: objetoId
        })
      });

      if (response.ok) {
        // Eliminar de la lista de guardados
        setGuardados(prev => prev.filter(id => id !== objetoId));
      } else {
        const errorData = await response.json();
        console.error('Error al eliminar de guardados:', errorData.message);
        alert('No se pudo eliminar el objeto de tus guardados');
      }
    } catch (error) {
      console.error('Error al eliminar de guardados:', error);
      alert('Error de conexión al intentar eliminar el objeto');
    }
  };

  const objetosFiltrados = objetos.filter((obj) =>
    obj.nombre.toLowerCase().includes(filtro.nombre.toLowerCase()) &&
    (filtro.epoca ? obj.epoca_id === parseInt(filtro.epoca) : true) &&
    (filtro.categoria ? obj.categoria_id === parseInt(filtro.categoria) : true) &&
    (filtro.procedencia ? obj.procedencia_id === parseInt(filtro.procedencia) : true) &&
    (filtro.estado ? obj.estado_conservacion_id === parseInt(filtro.estado) : true) &&
    (filtro.ubicacion ? obj.ubicacion_actual_id === parseInt(filtro.ubicacion) : true)
  );

  return (
    <div className="pt-25 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Barra de búsqueda y acciones */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            name="nombre"
            placeholder="Buscar objetos..."
            value={filtro.nombre}
            onChange={handleFiltroChange}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all duration-300"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            <span>Filtros</span>
          </button>
          
          {isAdmin && (
            <Link 
              to="/createObject" 
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Nuevo objeto</span>
            </Link>
          )}
        </div>
      </div>

      {/* Panel de filtros */}
      {isFilterOpen && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">Filtros avanzados</h2>
            <button 
              onClick={limpiarFiltros}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Limpiar todos
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Época</label>
              <select 
                name="epoca" 
                value={filtro.epoca} 
                onChange={handleFiltroChange} 
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none"
              >
                <option value="">Todas las épocas</option>
                {filtros.epocas.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre_epoca}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Categoría</label>
              <select 
                name="categoria" 
                value={filtro.categoria} 
                onChange={handleFiltroChange} 
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none"
              >
                <option value="">Todas las categorías</option>
                {filtros.categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.categoria}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Procedencia</label>
              <select 
                name="procedencia" 
                value={filtro.procedencia} 
                onChange={handleFiltroChange} 
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none"
              >
                <option value="">Todas las procedencias</option>
                {filtros.procedencias.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre_region}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Estado</label>
              <select 
                name="estado" 
                value={filtro.estado} 
                onChange={handleFiltroChange} 
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none"
              >
                <option value="">Todos los estados</option>
                {filtros.estados.map((e) => (
                  <option key={e.id} value={e.id}>{e.estado}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Ubicación</label>
              <select 
                name="ubicacion" 
                value={filtro.ubicacion} 
                onChange={handleFiltroChange} 
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none"
              >
                <option value="">Todas las ubicaciones</option>
                {filtros.ubicaciones.map((u) => (
                  <option key={u.id} value={u.id}>{u.museo}, {u.pais}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Contador de resultados */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          {objetosFiltrados.length} {objetosFiltrados.length === 1 ? 'objeto encontrado' : 'objetos encontrados'}
        </p>
        <div className="text-sm text-gray-500">
          {filtro.nombre || Object.values(filtro).some(v => v !== '') ? (
            <button onClick={limpiarFiltros} className="hover:text-gray-700 transition-colors">
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>

      {/* Galería */}
      {objetosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {objetosFiltrados.map((objeto) => (
            <div
              key={objeto.id}
              className="bg-gray-50 rounded-2xl shadow-xl hover:scale-[1.05] transition-transform duration-300 overflow-hidden transform-gpu relative flex flex-col h-full"
            >
              <div className="relative overflow-hidden flex-grow">
                <Link to={`/object/${objeto.id}`} className="block h-full">
                  <img
                    src={objeto.ruta_preview}
                    alt={objeto.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </Link>
                {isAdmin && (
                  <Link
                    to={`/editObject/${objeto.id}`}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors duration-300 shadow-md z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>
                )}
                
                {/* Botón para guardar/eliminar de guardados */}
                {user && (
                  <button 
                    onClick={() => 
                      guardados.includes(objeto.id) 
                        ? eliminarGuardado(objeto.id) 
                        : guardarObjeto(objeto.id)
                    }
                    className={`absolute top-3 ${isAdmin ? 'right-12' : 'right-3'} bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors z-10`}
                    disabled={loadingGuardados}
                    title={guardados.includes(objeto.id) 
                      ? "Quitar de guardados" 
                      : "Guardar objeto"}
                  >
                    {loadingGuardados ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
                        <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 ${guardados.includes(objeto.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`} 
                        viewBox="0 0 20 20" 
                        fill={guardados.includes(objeto.id) ? "currentColor" : "none"}
                        stroke="currentColor"
                      >
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              <div className="p-6 flex-grow-0">
                <Link to={`/object/${objeto.id}`} className="block">
                  <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">{objeto.nombre}</h2>
                  <p className="text-base md:text-lg text-gray-600 line-clamp-3">{objeto.descripcion}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center mb-16">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron objetos</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {filtro.nombre ? `No encontramos resultados para "${filtro.nombre}".` : "Intenta ajustar tus filtros de búsqueda."}
          </p>
          <button 
            onClick={limpiarFiltros}
            className="mt-6 px-5 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default GaleriaObjetos;