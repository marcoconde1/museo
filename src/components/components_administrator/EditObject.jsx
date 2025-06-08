import React, { useEffect, useState, useRef } from 'react'; // Añade useRef
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '/src/context/AuthContext'; // Ajusta la ruta
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EditObject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user && user.admin;

    useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fecha_creacion: '',
    valor_historico: '',
    nro_visitas: 0,
    ruta_preview: '',
    epoca_id: '',
    estado_conservacion_id: '',
    procedencia_id: '',
    categoria_id: '',
    autor_id: '',
    ubicacion_actual_id: ''
  });

  const [videoUrls, setVideoUrls] = useState([]);
  const [imagenFiles, setImagenFiles] = useState([]);
  const [modelo, setModelo] = useState({ ruta_modelo: '', ruta_fondo: '' });
  const [modelExists, setModelExists] = useState(false);
  const [removedVideoIds, setRemovedVideoIds] = useState([]);
  const [removedImagenIds, setRemovedImagenIds] = useState([]);
  const [selectData, setSelectData] = useState({
    epocas: [], estados: [], procedencias: [], categorias: [], autores: [], ubicaciones: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del objeto
        const objetoRes = await axios.get(`/api/objetos/${id}`);
        const objetoData = objetoRes.data;
        setForm({
          ...objetoData,
          fecha_creacion: formatDate(objetoData.fecha_creacion),
        });

        // Obtener datos para selects
        const [epocas, estados, procedencias, categorias, autores, ubicaciones] = await Promise.all([
          axios.get('/api/epocas'),
          axios.get('/api/estados'),
          axios.get('/api/procedencias'),
          axios.get('/api/categorias'),
          axios.get('/api/autores'),
          axios.get('/api/ubicaciones')
        ]);
        setSelectData({
          epocas: epocas.data,
          estados: estados.data,
          procedencias: procedencias.data,
          categorias: categorias.data,
          autores: autores.data,
          ubicaciones: ubicaciones.data
        });

        // Obtener videos
        try {
          const videosRes = await axios.get(`/api/videos/${id}`);
          setVideoUrls(videosRes.data.length > 0 
            ? videosRes.data.map(v => ({ id: v.id, ruta_video: v.ruta_video })) 
            : [{ id: null, ruta_video: '' }]
          );
        } catch {
          setVideoUrls([{ id: null, ruta_video: '' }]);
        }

        // Obtener imágenes
        try {
          const imagenesRes = await axios.get(`/api/imagenes/${id}`);
          setImagenFiles(imagenesRes.data.length > 0 
            ? imagenesRes.data.map(i => ({ id: i.id, ruta_imagen: i.ruta_imagen })) 
            : [{ id: null, ruta_imagen: '' }]
          );
        } catch {
          setImagenFiles([{ id: null, ruta_imagen: '' }]);
        }

        // Obtener modelo
        try {
          const modeloRes = await axios.get(`/api/modelos/${id}`);
          if (modeloRes.data) {
            setModelo({
              ruta_modelo: modeloRes.data.ruta_modelo || '',
              ruta_fondo: modeloRes.data.ruta_fondo || ''
            });
            setModelExists(true);
          }
        } catch {
          setModelo({ ruta_modelo: '', ruta_fondo: '' });
          setModelExists(false);
        }
      } catch (err) {
        console.error('Error cargando datos', err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files, dataset } = e.target;
    const idx = Number(dataset.idx);

    if (name === 'videoUrls') {
      setVideoUrls(prev => {
        const arr = [...prev];
        arr[idx].ruta_video = value;
        return arr;
      });
      return;
    }
  // Modificado: Guarda rutas completas para imágenes
  if (name === 'imagenFiles') {
    if (files[0]) {
      const ruta = `/imagenes/${files[0].name}`;
      setImagenFiles(prev => {
        const arr = [...prev];
        arr[idx].ruta_imagen = ruta;
        return arr;
      });
    }
    return;
  }

  const { type } = e.target;
  if (type === 'file') {
    if (files[0]) {
      let ruta = '';
      
      if (name === 'ruta_preview') {
        ruta = `/imagenes/${files[0].name}`;
        setForm(prev => ({ ...prev, ruta_preview: ruta }));
      } else if (name === 'ruta_modelo') {
        // Extraer el nombre del modelo sin la extensión
        const fileName = files[0].name;
        const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        ruta = `/modelos/${baseName}/${fileName}`;
        setModelo(prev => ({ ...prev, ruta_modelo: ruta }));
      } else if (name === 'ruta_fondo') {
        ruta = `/fondos/${files[0].name}`;
        setModelo(prev => ({ ...prev, ruta_fondo: ruta }));
      }
    }
    return;
  }

  setForm(prev => ({ ...prev, [name]: value }));
};

  const addVideoField = () => 
    setVideoUrls(v => [...v, { id: null, ruta_video: '' }]);

  const removeVideoField = idx => {
    if (videoUrls.length === 1) return;
    const item = videoUrls[idx];
    if (item?.id) setRemovedVideoIds(prev => [...prev, item.id]);
    setVideoUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const addImagenField = () => 
    setImagenFiles(i => [...i, { id: null, ruta_imagen: '' }]);

  const removeImagenField = idx => {
    if (imagenFiles.length === 1) return;
    const item = imagenFiles[idx];
    if (item?.id) setRemovedImagenIds(prev => [...prev, item.id]);
    setImagenFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.ruta_preview?.trim()) {
     toast.error('Debe seleccionar o conservar un archivo de preview.');
      setLoading(false);
      return;
    }


    const cantidadVideosValidos = videoUrls.filter(v => v.ruta_video?.trim() !== '').length;
    if (cantidadVideosValidos < 1) {
      toast.error('Debe ingresar al menos una URL de video.');
      setLoading(false);
      return;
    }

    const cantidadImagenesValidas = imagenFiles.filter(i => i.ruta_imagen?.trim() !== '').length;
    if (cantidadImagenesValidas < 1) {
      toast.error('Debe subir al menos una imagen.');
      setLoading(false);
      return;
    }

    const tieneModelo = modelo.ruta_modelo?.trim() !== '';
    const tieneFondo = modelo.ruta_fondo?.trim() !== '';
    if ((tieneModelo && !tieneFondo) || (!tieneModelo && tieneFondo)) {
      toast.error('Si sube un modelo, también debe subir un fondo (y viceversa).');
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      nro_visitas: parseInt(form.nro_visitas) || 0,
      ruta_preview: form.ruta_preview
    };

    try {
      await axios.put(`http://localhost:3000/api/objetos/${id}`, payload);

      if (!tieneModelo && !tieneFondo && modelExists) {
        await axios.delete(`http://localhost:3000/api/modelos/${id}`);
        setModelExists(false);
      } else if (tieneModelo && tieneFondo) {
        if (modelExists) {
          await axios.put(`http://localhost:3000/api/modelos/${id}`, {
            ruta_modelo: modelo.ruta_modelo,
            ruta_fondo: modelo.ruta_fondo
          });
        } else {
          await axios.post('http://localhost:3000/api/modelos', {
            ruta_modelo: modelo.ruta_modelo,
            ruta_fondo: modelo.ruta_fondo,
            OBJETO_id: id
          });
          setModelExists(true);
        }
      }

      await Promise.all(
        videoUrls.map(v => {
          if (v.id) {
            return axios.put(`http://localhost:3000/api/videos/${v.id}`, { ruta_video: v.ruta_video });
          } else if (v.ruta_video) {
            return axios.post('http://localhost:3000/api/videos', {
              ruta_video: v.ruta_video,
              objeto_id: id
            });
          }
        })
      );

      await Promise.all(
        imagenFiles.map(img => {
          if (img.id) {
            return axios.put(`http://localhost:3000/api/imagenes/${img.id}`, { ruta_imagen: img.ruta_imagen });
          } else if (img.ruta_imagen) {
            return axios.post('http://localhost:3000/api/imagenes', {
              ruta_imagen: img.ruta_imagen,
              objeto_id: id
            });
          }
        })
      );

      await Promise.all([
        ...removedVideoIds.map(vid => axios.delete(`http://localhost:3000/api/videos/id/${vid}`)),
        ...removedImagenIds.map(iid => axios.delete(`http://localhost:3000/api/imagenes/id/${iid}`))
      ]);

      toast.success('Objeto actualizado correctamente');
      setTimeout(() => navigate('/gallery'), 2000);
    } catch (err) {
      console.error('Error al actualizar', err);
      toast.error('Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  // ... estados previos
  const deleteToastId = useRef(null); // Añade esta línea


   const handleDelete = async () => {
    try {
      // Cerrar el toast de confirmación si existe
      if (deleteToastId.current) {
        toast.dismiss(deleteToastId.current);
      }
      
      await Promise.all([
        axios.delete(`http://localhost:3000/api/imagenes/${id}`),
        axios.delete(`http://localhost:3000/api/videos/${id}`),
        axios.delete(`http://localhost:3000/api/modelos/${id}`)
      ]);

      await axios.delete(`http://localhost:3000/api/objetos/${id}`);
      toast.success('Objeto eliminado correctamente');
      setTimeout(() => navigate('/gallery'), 2000);
    } catch (err) {
      console.error('Error al eliminar objeto', err);
      
      let errorMessage = 'Error al eliminar';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'No autorizado - inicie sesión nuevamente';
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const confirmDelete = () => {
    // Cerrar cualquier toast existente
    if (deleteToastId.current) {
      toast.dismiss(deleteToastId.current);
    }
    
    deleteToastId.current = toast.info(
      <div className="p-4">
        <h3 className="font-bold text-lg mb-3">¿Eliminar objeto?</h3>
        <p className="mb-4">¿Seguro que deseas eliminar este objeto y sus archivos asociados?</p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => {
              toast.dismiss(deleteToastId.current);
              deleteToastId.current = null;
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
          >
            Eliminar
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        style: {
          width: '100%',
          maxWidth: '500px'
        }
      }
    );
  };




  // Estilo para el botón animado
  const buttonStyle = `
    transition-transform duration-300 group relative bg-black text-white py-2 px-4 
    rounded-md overflow-hidden w-full text-center cursor-pointer hover:bg-gray-900
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <ToastContainer 
        position="top-right" 
        autoClose={5000}
        style={{ zIndex: 10000 }} 
      />
      <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Editar Objeto</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección 1: Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
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
                value={form.fecha_creacion}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
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
                value={form.valor_historico}
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
                value={form.nro_visitas}
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
                value={form.epoca_id}
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
                value={form.ubicacion_actual_id}
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
                value={form.estado_conservacion_id}
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
                value={form.procedencia_id}
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
                value={form.categoria_id}
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
                value={form.autor_id}
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

          {/* Sección 3: Multimedia */}
          <div className="grid grid-cols-1 gap-6 border-t pt-6">
            <div className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Videos:</label>
                <button 
                  type="button" 
                  onClick={addVideoField}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                >
                  + Añadir Video
                </button>
              </div>
              
              {videoUrls.map((v, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="text"
                    name="videoUrls"
                    data-idx={idx}
                    value={v.ruta_video}
                    onChange={handleChange}
                    placeholder="Nombre del archivo de video"
                    className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black mr-2"
                    required={idx === 0}
                  />
                  <button 
                    type="button" 
                    onClick={() => removeVideoField(idx)}
                    disabled={videoUrls.length === 1}
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
              
              {imagenFiles.map((img, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="file"
                    name="imagenFiles"
                    data-idx={idx}
                    onChange={handleChange}
                    className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black mr-2"
                  />
                  {img.ruta_imagen && (
                    <span className="text-sm text-gray-500">Archivo: {img.ruta_imagen}</span>
                  )}
                  <button 
                    type="button" 
                    onClick={() => removeImagenField(idx)}
                    disabled={imagenFiles.length === 1}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded"
                  >
                    -
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preview:</label>
                {form.ruta_preview ? (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">{form.ruta_preview}</span>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, ruta_preview: '' }))}
                      className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    name="ruta_preview"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo:</label>
                  {modelo.ruta_modelo ? (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">{modelo.ruta_modelo}</span>
                      <button
                        type="button"
                        onClick={() => setModelo(prev => ({ ...prev, ruta_modelo: '' }))}
                        className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      name="ruta_modelo"
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fondo:</label>
                  {modelo.ruta_fondo ? (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">{modelo.ruta_fondo}</span>
                      <button
                        type="button"
                        onClick={() => setModelo(prev => ({ ...prev, ruta_fondo: '' }))}
                        className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      name="ruta_fondo"
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <div>
              <button 
                type="submit" 
                disabled={loading} 
                className={`${buttonStyle} group`}
              >
                <div className="h-6 overflow-hidden">
                  <div className="transform transition-transform duration-300 group-hover:-translate-y-6">
                    <span className="block h-6 leading-6">
                      {loading ? 'Actualizando...' : 'Actualizar Objeto'}
                    </span>
                    <span className="block h-6 leading-6">
                      {loading ? 'Actualizando...' : 'Actualizar Objeto'}
                    </span>
                  </div>
                </div>
              </button>
            </div>
            
            <div>
         <button
          type="button"
          onClick={confirmDelete}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Eliminar Objeto
        </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditObject;