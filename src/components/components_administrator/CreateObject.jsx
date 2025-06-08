import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateObject = () => {
  const { user } = useAuth();
  const isAdmin = user && user.admin;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_creacion: '',
    valor_historico: '',
    nro_visitas: 0,
    ruta_preview: null,
    epoca_id: '',
    ubicacion_actual_id: '',
    estado_conservacion_id: '',
    procedencia_id: '',
    categoria_id: '',
    autor_id: '',
    video_urls: [''],           
    imagen_archivos: [''], 
    modelo_archivo: null,  
    fondo_archivo: null
  });

  const [selectData, setSelectData] = useState({
    epocas: [],
    estados: [],
    procedencias: [],
    categorias: [],
    autores: [],
    ubicaciones: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirigir si no es admin
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [epocas, estados, procedencias, categorias, autores, ubicaciones] = await Promise.all([
          axios.get('http://localhost:3000/api/epocas'),
          axios.get('http://localhost:3000/api/estados'),
          axios.get('http://localhost:3000/api/procedencias'),
          axios.get('http://localhost:3000/api/categorias'),
          axios.get('http://localhost:3000/api/autores'),
          axios.get('http://localhost:3000/api/ubicaciones'),
        ]);
        setSelectData({
          epocas: epocas.data,
          estados: estados.data,
          procedencias: procedencias.data,
          categorias: categorias.data,
          autores: autores.data,
          ubicaciones: ubicaciones.data
        });
      } catch (error) {
        console.error('Error al cargar datos de selects', error);
        toast.error('Error al cargar datos del formulario');
      }
    };
    fetchData();
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === 'video_urls') {
      const idx = Number(e.target.dataset.index);
      setFormData(prev => {
        const arr = [...prev.video_urls];
        arr[idx] = value;
        return { ...prev, video_urls: arr };
      });
      return;
    }

    if (name === 'imagen_archivos') {
      const idx = Number(e.target.dataset.index);
      if (files[0]) {
        const ruta = `/imagenes/${files[0].name}`;
        setFormData(prev => {
          const arr = [...prev.imagen_archivos];
          arr[idx] = ruta;
          return { ...prev, imagen_archivos: arr };
        });
      }
      return;
    }

    if (type === 'file' && ['ruta_preview','modelo_archivo','fondo_archivo'].includes(name)) {
      if (files[0]) {
        let folder = '';
        let ruta = '';

        if (name === 'ruta_preview') {
          folder = '/previews/';
          ruta = `${folder}${files[0].name}`;
        } else if (name === 'modelo_archivo') {
          const fileName = files[0].name;
          const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
          folder = `/modelos/${baseName}/`;
          ruta = `${folder}${fileName}`;
        } else if (name === 'fondo_archivo') {
          folder = '/fondos/';
          ruta = `${folder}${files[0].name}`;
        }

        setFormData(prev => ({ ...prev, [name]: ruta }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addVideoField = () => {
    setFormData(prev => ({ ...prev, video_urls: [...prev.video_urls, ''] }));
  };
  
  const removeVideoField = idx => {
    setFormData(prev => ({
      ...prev,
      video_urls: prev.video_urls.filter((_, i) => i !== idx)
    }));
  };

  const addImagenField = () => {
    setFormData(prev => ({ ...prev, imagen_archivos: [...prev.imagen_archivos, ''] }));
  };
  
  const removeImagenField = idx => {
    setFormData(prev => ({
      ...prev,
      imagen_archivos: prev.imagen_archivos.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar permisos nuevamente
    if (!isAdmin) {
      toast.error('Acceso denegado');
      navigate('/');
      return;
    }
    
    setLoading(true);

    const cantidadVideosValidos = formData.video_urls.filter(url => url.trim() !== '').length;
    const cantidadImagenesValidas = formData.imagen_archivos.filter(img => img.trim() !== '').length;
    const cantidadPreview = formData.ruta_preview;

    if (!cantidadPreview) {
      toast.error('Debe subir al menos una imagen preview');
      setLoading(false);
      return;
    }

    if (cantidadVideosValidos < 1) {
      toast.error('Debe ingresar al menos una URL de video');
      setLoading(false);
      return;
    }

    if (cantidadImagenesValidas < 1) {
      toast.error('Debe subir al menos una imagen');
      setLoading(false);
      return;
    }

    const modelo = formData.modelo_archivo;
    const fondo = formData.fondo_archivo;

    if ((modelo && !fondo) || (!modelo && fondo)) {
      toast.error('Debe subir tanto el modelo como el fondo, o ninguno de los dos');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/objetos', formData);
      const objetoCreado = res.data;

      await Promise.all(
        formData.video_urls
          .filter(url => url)
          .map(url =>
            axios.post('http://localhost:3000/api/videos', {
              ruta_video: url,
              objeto_id: objetoCreado.id
            })
          )
      );

      await Promise.all(
        formData.imagen_archivos
          .filter(name => name)
          .map(name =>
            axios.post('http://localhost:3000/api/imagenes', {
              ruta_imagen: name,
              objeto_id: objetoCreado.id
            })
          )
      );

      if (modelo && fondo) {
        await axios.post('http://localhost:3000/api/modelos', {
          ruta_modelo: modelo,
          ruta_fondo: fondo,
          OBJETO_id: objetoCreado.id
        });
      }

      toast.success('Objeto creado exitosamente!');
      setTimeout(() => navigate('/gallery'), 2000);
    } catch (error) {
      console.error('Error al crear el objeto:', error);
      toast.error('Error al crear el objeto');
    } finally {
      setLoading(false);
    }
  };

  // Estilo para el botón animado
  const buttonStyle = `
    transition-transform duration-300 group relative bg-black text-white py-2 px-4 
    rounded-md overflow-hidden w-full text-center cursor-pointer hover:bg-gray-900
  `;

  // Si no es admin, no renderizar el formulario
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
          <ToastContainer 
              position="top-right" 
              autoClose={5000}
              style={{ zIndex: 10000 }} 
            />
      
      <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Crear Nuevo Objeto</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección 1: Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Creación:</label>
              <input
                type="date"
                name="fecha_creacion"
                value={formData.fecha_creacion}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Histórico:</label>
              <textarea
                name="valor_historico"
                value={formData.valor_historico}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nro. Visitas:</label>
              <input
                type="number"
                name="nro_visitas"
                value={formData.nro_visitas}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Sección 2: Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Época:</label>
              <select
                name="epoca_id"
                value={formData.epoca_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Seleccione una época</option>
                {selectData.epocas.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre_epoca}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación Actual:</label>
              <select
                name="ubicacion_actual_id"
                value={formData.ubicacion_actual_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Seleccione una ubicación</option>
                {selectData.ubicaciones.map(u => (
                  <option key={u.id} value={u.id}>{u.pais} --- {u.museo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Conservación:</label>
              <select
                name="estado_conservacion_id"
                value={formData.estado_conservacion_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Seleccione un estado</option>
                {selectData.estados.map(e => (
                  <option key={e.id} value={e.id}>{e.estado}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Procedencia:</label>
              <select
                name="procedencia_id"
                value={formData.procedencia_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Seleccione una procedencia</option>
                {selectData.procedencias.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre_region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría:</label>
              <select
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Seleccione una categoría</option>
                {selectData.categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.categoria}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autor:</label>
              <select
                name="autor_id"
                value={formData.autor_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Seleccione un autor</option>
                {selectData.autores.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sección 3: Archivos y multimedia */}
          <div className="grid grid-cols-1 gap-6 border-t pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Preview:</label>
              <input
                type="file"
                name="ruta_preview"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              {formData.ruta_preview && (
                <p className="text-sm text-gray-500 mt-1">Archivo seleccionado: {formData.ruta_preview}</p>
              )}
            </div>

            <div className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">URLs de Video:</label>
                <button 
                  type="button" 
                  onClick={addVideoField}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                >
                  + Añadir Video
                </button>
              </div>
              
              {formData.video_urls.map((url, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="url"
                    name="video_urls"
                    data-index={idx}
                    value={url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black mr-2"
                    required={idx === 0}
                  />
                  <button 
                    type="button" 
                    onClick={() => removeVideoField(idx)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded"
                  >
                    -
                  </button>
                </div>
              ))}
            </div>

            <div className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Imágenes:</label>
                <button 
                  type="button" 
                  onClick={addImagenField}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                >
                  + Añadir Imagen
                </button>
              </div>
              
              {formData.imagen_archivos.map((img, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="file"
                    name="imagen_archivos"
                    data-index={idx}
                    onChange={handleChange}
                    className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black mr-2"
                  />
                  {img && <span className="text-sm text-gray-500">Seleccionado: {img}</span>}
                  <button 
                    type="button" 
                    onClick={() => removeImagenField(idx)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded"
                  >
                    -
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Archivo Modelo:</label>
                <input
                  type="file"
                  name="modelo_archivo"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {formData.modelo_archivo && (
                  <p className="text-sm text-gray-500 mt-1">Archivo seleccionado: {formData.modelo_archivo}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Archivo Fondo:</label>
                <input
                  type="file"
                  name="fondo_archivo"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {formData.fondo_archivo && (
                  <p className="text-sm text-gray-500 mt-1">Archivo seleccionado: {formData.fondo_archivo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="mt-10">
            <button 
              type="submit" 
              disabled={loading} 
              className={`${buttonStyle} group`}
            >
              <div className="h-6 overflow-hidden">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-6">
                  <span className="block h-6 leading-6">
                    {loading ? 'Creando objeto...' : 'Crear Objeto'}
                  </span>
                  <span className="block h-6 leading-6">
                    {loading ? 'Creando objeto...' : 'Crear Objeto'}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateObject;