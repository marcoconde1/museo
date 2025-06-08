// src/pages/SavedObjects.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SavedObjects = () => {
  const [objetos, setObjetos] = useState([]);
  const [filtros, setFiltros] = useState({
    epocas: [],
    categorias: [],
    procedencias: [],
    estados: [],
    ubicaciones: [],
  });

  const [filtro, setFiltro] = useState({
    nombre: '',
    epoca: '',
    categoria: '',
    procedencia: '',
    estado: '',
    ubicacion: '',
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user && user.admin;

  // Cargar objetos guardados y filtros
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Verificar si el usuario está autenticado
        if (!user) {
          console.error('Usuario no autenticado');
          return;
        }
        
        // Obtener objetos guardados
        const resGuardados = await fetch(`/api/favoritos/usuario/${user.id}`);
        if (!resGuardados.ok) throw new Error('Error en favoritos');
        const guardadosData = await resGuardados.json();
        
        const objetoIds = guardadosData.map(fav => fav.objeto_id); 
        
        // Obtener detalles de los objetos guardados
        const resObjetos = await fetch('/api/objetos');
        const todosObjetos = await resObjetos.json();
        
        // Filtrar solo los objetos que están en guardados
        const objetosGuardados = todosObjetos.filter(obj => 
          objetoIds.includes(obj.id)
        );
        
        // Cargar datos de filtros
        const [resEpocas, resCategorias, resProcedencias, resEstados, resUbicaciones] = await Promise.all([
          fetch('/api/epocas'),
          fetch('/api/categorias'),
          fetch('/api/procedencias'),
          fetch('/api/estados'),
          fetch('/api/ubicaciones'),
        ]);

        const [epocas, categorias, procedencias, estados, ubicaciones] = await Promise.all([
          resEpocas.json(),
          resCategorias.json(),
          resProcedencias.json(),
          resEstados.json(),
          resUbicaciones.json(),
        ]);

        setObjetos(objetosGuardados);
        setFiltros({ epocas, categorias, procedencias, estados, ubicaciones });
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
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
        // Eliminar el objeto de la lista local
        setObjetos(prev => prev.filter(obj => obj.id !== objetoId));
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

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="pt-20 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando tus objetos guardados...</p>
        </div>
      </div>
    );
  }

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
            placeholder="Buscar en mis guardados..."
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
          {objetosFiltrados.length} {objetosFiltrados.length === 1 ? 'objeto guardado' : 'objetos guardados'}
        </p>
        <div className="text-sm text-gray-500">
          {filtro.nombre || Object.values(filtro).some(v => v !== '') ? (
            <button onClick={limpiarFiltros} className="hover:text-gray-700 transition-colors">
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>

      {/* Galería de guardados con estilo similar */}
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
                    src={objeto.ruta_preview || "https://via.placeholder.com/400?text=Imagen+no+disponible"}
                    alt={objeto.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </Link>
                
                {/* Botón para eliminar de guardados */}
                <button 
                  onClick={() => eliminarGuardado(objeto.id)}
                  className={`absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors`}
                  title="Eliminar de guardados"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-red-500 fill-current" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>

    

              </div>
              <div className="p-6 flex-grow-0">
                <Link to={`/object/${objeto.id}`} className="block">
                  <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">{objeto.nombre}</h2>
                  <p className="text-base md:text-lg text-gray-600 line-clamp-3">{objeto.descripcion || "Descripción no disponible"}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center mb-16">
     
          <h3 className="text-xl font-medium text-gray-700 mb-2">Aún no tienes objetos guardados</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Guarda objetos que te interesen para encontrarlos fácilmente aquí
          </p>
          <Link 
            to="/gallery"
            className="mt-6 inline-block px-5 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Explorar objetos
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedObjects;