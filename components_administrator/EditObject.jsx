import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const [videoUrls, setVideoUrls]     = useState([]);     
  const [imagenFiles, setImagenFiles] = useState([]);  

  const [modelo, setModelo]         = useState({ ruta_modelo: '', ruta_fondo: '' });
  const [modelExists, setModelExists] = useState(false);

  const [removedVideoIds, setRemovedVideoIds]   = useState([]);
  const [removedImagenIds, setRemovedImagenIds] = useState([]);

  const [selectData, setSelectData] = useState({
    epocas: [], estados: [], procedencias: [], categorias: [], autores: [], ubicaciones: []
  });

  useEffect(() => {
    // 1) Cargar datos del objeto
    const fetchObjeto = async () => {
      try {
        const res = await axios.get(`/api/objetos/${id}`);
        const data = res.data;
        setForm({
          ...data,
          fecha_creacion: formatDate(data.fecha_creacion),
        });
      } catch (err) {
        console.error('Error al cargar el objeto', err);
      }
    };

    // 2) Cargar selects (épocas, estados, etc.)
    const fetchSelects = async () => {
      try {
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
      } catch (err) {
        console.error('Error cargando datos de los selects', err);
      }
    };

    // 3) Cargar videos existentes (o inicializar con uno en blanco)
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/api/videos/${id}`);
        if (res.data.length > 0) {
          setVideoUrls(res.data.map(v => ({ id: v.id, ruta_video: v.ruta_video })));
        } else {
          setVideoUrls([{ id: null, ruta_video: '' }]);
        }
      } catch (err) {
        console.warn('No videos para este objeto');
        setVideoUrls([{ id: null, ruta_video: '' }]);
      }
    };

    // 4) Cargar imágenes existentes (o inicializar con una en blanco)
    const fetchImagen = async () => {
      try {
        const res = await axios.get(`/api/imagenes/${id}`);
        if (res.data.length > 0) {
          setImagenFiles(res.data.map(i => ({ id: i.id, ruta_imagen: i.ruta_imagen })));
        } else {
          setImagenFiles([{ id: null, ruta_imagen: '' }]);
        }
      } catch (err) {
        console.warn('No imágenes para este objeto');
        setImagenFiles([{ id: null, ruta_imagen: '' }]);
      }
    };

    // 5) Cargar modelo existente o detectarlo
    const fetchModelo = async () => {
      try {
        const res = await axios.get(`/api/modelos/${id}`);
        // Si existe, marcamos modelExists = true
        if (res.data) {
          setModelo({
            ruta_modelo: res.data.ruta_modelo || '',
            ruta_fondo:   res.data.ruta_fondo   || ''
          });
          setModelExists(true);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // No existe modelo en BD
          setModelo({ ruta_modelo: '', ruta_fondo: '' });
          setModelExists(false);
        } else {
          console.warn('Error al obtener modelo:', err.message);
        }
      }
    };

    fetchObjeto();
    fetchSelects();
    fetchVideo();
    fetchImagen();
    fetchModelo();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files, dataset } = e.target;
    const idx = Number(dataset.idx);

    // Campos dinámicos videoUrls[]
    if (name === 'videoUrls') {
      setVideoUrls(prev => {
        const arr = [...prev];
        arr[idx].ruta_video = value;
        return arr;
      });
      return;
    }

    // Campos dinámicos imagenFiles[]
    if (name === 'imagenFiles') {
      const filename = files[0]?.name || '';
      setImagenFiles(prev => {
        const arr = [...prev];
        arr[idx].ruta_imagen = filename;
        return arr;
      });
      return;
    }

    // Campos únicos: tipo file (preview, modelo, fondo) o inputs de texto normales
    const { type } = e.target;
    if (type === 'file') {
      const filename = files[0]?.name || '';
      if (name === 'ruta_preview') {
        setForm(prev => ({ ...prev, ruta_preview: filename }));
      } else if (name === 'ruta_modelo') {
        setModelo(prev => ({ ...prev, ruta_modelo: filename }));
      } else if (name === 'ruta_fondo') {
        setModelo(prev => ({ ...prev, ruta_fondo: filename }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Videos
  const addVideoField = () =>
    setVideoUrls(v => [...v, { id: null, ruta_video: '' }]);

  const removeVideoField = idx => {
    if (videoUrls.length === 1) return; // Siempre al menos uno
    const item = videoUrls[idx];
    if (item?.id) {
      setRemovedVideoIds(prev => [...prev, item.id]);
    }
    setVideoUrls(prev => prev.filter((_, i) => i !== idx));
  };

  // Imágenes
  const addImagenField = () =>
    setImagenFiles(i => [...i, { id: null, ruta_imagen: '' }]);

  const removeImagenField = idx => {
    if (imagenFiles.length === 1) return; // Siempre al menos una
    const item = imagenFiles[idx];
    if (item?.id) {
      setRemovedImagenIds(prev => [...prev, item.id]);
    }
    setImagenFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ──────── 1️⃣ Validaciones ────────

  // ❌  ruta_preview no puede quedar vacía
  if (!form.ruta_preview?.trim()) {
    alert('Debe seleccionar o conservar un archivo de preview.');
    return;
  }

  // ❌ Al menos una URL de video
  const cantidadVideosValidos = videoUrls.filter(v => v.ruta_video?.trim() !== '').length;
  if (cantidadVideosValidos < 1) {
    alert('Debe ingresar al menos una URL de video.');
    return;
  }

  // ❌ Al menos una imagen
  const cantidadImagenesValidas = imagenFiles.filter(i => i.ruta_imagen?.trim() !== '').length;
  if (cantidadImagenesValidas < 1) {
    alert('Debe subir al menos una imagen.');
    return;
  }

  // ❌ Si existe modelo → debe existir fondo y viceversa
  const tieneModelo = modelo.ruta_modelo?.trim() !== '';
  const tieneFondo  = modelo.ruta_fondo?.trim()   !== '';
  if ((tieneModelo && !tieneFondo) || (!tieneModelo && tieneFondo)) {
    alert('Si sube un modelo, también debe subir un fondo (y viceversa).');
    return;
  }

  // ──────── 2️⃣ Construir payload básico ────────
  const payload = {
    ...form,
    nro_visitas: parseInt(form.nro_visitas) || 0,
    ruta_preview: form.ruta_preview
  };

  try {
    // A) Actualizar datos básicos del objeto
    await axios.put(`http://localhost:3000/api/objetos/${id}`, payload);

    // B) Eliminar modelo si ambos campos quedaron vacíos y antes existía
    if (!tieneModelo && !tieneFondo && modelExists) {
      await axios.delete(`http://localhost:3000/api/modelos/${id}`);
      setModelExists(false);
    }
    // Si se cargaron ambos campos, crear o actualizar el modelo
    else if (tieneModelo && tieneFondo) {
      if (modelExists) {
        // Ya existía → hacer PUT
        await axios.put(`http://localhost:3000/api/modelos/${id}`, {
          ruta_modelo: modelo.ruta_modelo,
          ruta_fondo:   modelo.ruta_fondo
        });
      } else {
        // No existía → hacer POST
        await axios.post('http://localhost:3000/api/modelos', {
          ruta_modelo: modelo.ruta_modelo,
          ruta_fondo:   modelo.ruta_fondo,
          OBJETO_id:   id
        });
        setModelExists(true);
      }
    }

    // C) Videos (PUT a existentes / POST a nuevos)
    await Promise.all(
      videoUrls.map(v => {
        if (v.id) {
          return axios.put(`http://localhost:3000/api/videos/${v.id}`, { ruta_video: v.ruta_video });
        } else if (v.ruta_video) {
          return axios.post('http://localhost:3000/api/videos', {
            ruta_video: v.ruta_video,
            objeto_id:  id
          });
        }
      })
    );

    // D) Imágenes (PUT a existentes / POST a nuevas)
    await Promise.all(
      imagenFiles.map(img => {
        if (img.id) {
          return axios.put(`http://localhost:3000/api/imagenes/${img.id}`, { ruta_imagen: img.ruta_imagen });
        } else if (img.ruta_imagen) {
          return axios.post('http://localhost:3000/api/imagenes', {
            ruta_imagen: img.ruta_imagen,
            objeto_id:   id
          });
        }
      })
    );

    // E) Borrar videos e imágenes marcados usando /videos/id/:id y /imagenes/id/:id
    await Promise.all([
      ...removedVideoIds.map(vid =>
        axios.delete(`http://localhost:3000/api/videos/id/${vid}`)
      ),
      ...removedImagenIds.map(iid =>
        axios.delete(`http://localhost:3000/api/imagenes/id/${iid}`)
      )
    ]);

    alert('Objeto, videos, imágenes y modelo actualizados correctamente');
  } catch (err) {
    console.error('Error al actualizar', err.response?.data || err.message);
    alert('Error al actualizar');
  }
};


  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar este objeto y sus archivos asociados?')) return;

    try {
      // Eliminar multimedia asociada directamente
      await Promise.all([
        axios.delete(`http://localhost:3000/api/imagenes/${id}`),
        axios.delete(`http://localhost:3000/api/videos/${id}`),
        axios.delete(`http://localhost:3000/api/modelos/${id}`)
      ]);

      // Luego eliminar el objeto
      await axios.delete(`http://localhost:3000/api/objetos/${id}`);
      alert('Objeto e información asociada eliminados correctamente');
      navigate('/gallery');
    } catch (err) {
      console.error('Error al eliminar objeto o sus archivos', err);
      alert('Error al eliminar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 100 }}></div>
      <h2>Editar Objeto</h2>
      <div style={{ marginBottom: 50 }}></div>

      <label>Nombre:</label>
      <input
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />
      <div style={{ marginBottom: 10 }}></div>

      <label>Descripción:</label>
      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        required
      />
      <div style={{ marginBottom: 10 }}></div>

      <label>Fecha de Creación:</label>
      <input
        type="date"
        name="fecha_creacion"
        value={form.fecha_creacion}
        onChange={handleChange}
        required
      />
      <div style={{ marginBottom: 10 }}></div>

      <label>Valor Histórico:</label>
      <textarea
        name="valor_historico"
        value={form.valor_historico}
        onChange={handleChange}
        required
      />
      <div style={{ marginBottom: 10 }}></div>

      <label>Nro. Visitas:</label>
      <input
        type="number"
        name="nro_visitas"
        value={form.nro_visitas}
        onChange={handleChange}
        required
      />
      <div style={{ marginBottom: 10 }}></div>

      <label>Época:</label>
      <select
        name="epoca_id"
        value={form.epoca_id}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione una época</option>
        {selectData.epocas.map(e => (
          <option key={e.id} value={e.id}>{e.nombre_epoca}</option>
        ))}
      </select>
      <div style={{ marginBottom: 10 }}></div>

      <label>Ubicación Actual:</label>
      <select
        name="ubicacion_actual_id"
        value={form.ubicacion_actual_id}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione una ubicación</option>
        {selectData.ubicaciones.map(u => (
          <option key={u.id} value={u.id}>{u.pais + " --- " + u.museo}</option>
        ))}
      </select>
      <div style={{ marginBottom: 10 }}></div>

      <label>Estado de Conservación:</label>
      <select
        name="estado_conservacion_id"
        value={form.estado_conservacion_id}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione un estado</option>
        {selectData.estados.map(e => (
          <option key={e.id} value={e.id}>{e.estado}</option>
        ))}
      </select>
      <div style={{ marginBottom: 10 }}></div>

      <label>Procedencia:</label>
      <select
        name="procedencia_id"
        value={form.procedencia_id}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione una procedencia</option>
        {selectData.procedencias.map(p => (
          <option key={p.id} value={p.id}>{p.nombre_region}</option>
        ))}
      </select>
      <div style={{ marginBottom: 10 }}></div>

      <label>Categoría:</label>
      <select
        name="categoria_id"
        value={form.categoria_id}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione una categoría</option>
        {selectData.categorias.map(c => (
          <option key={c.id} value={c.id}>{c.categoria}</option>
        ))}
      </select>
      <div style={{ marginBottom: 10 }}></div>

      <label>Autor:</label>
      <select
        name="autor_id"
        value={form.autor_id}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione un autor</option>
        {selectData.autores.map(a => (
          <option key={a.id} value={a.id}>{a.nombre}</option>
        ))}
      </select>
      <div style={{ marginBottom: 10 }}></div>

      {/* Videos dinámicos */}
      <label>Videos:</label>
      {videoUrls.map((v, idx) => (
        <div
          key={idx}
          style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
        >
          <input
            type="text"
            name="videoUrls"
            data-idx={idx}
            value={v.ruta_video}
            onChange={handleChange}
            placeholder="Nombre del archivo de video"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => removeVideoField(idx)}
            disabled={videoUrls.length === 1}
            style={{ marginLeft: 8 }}
          >
            – Quitar Video
          </button>
        </div>
      ))}
      <button type="button" onClick={addVideoField}>+ Añadir video</button>
      <div style={{ marginBottom: 10 }}></div>

      {/* Imágenes dinámicas */}
      <label>Imágenes:</label>
      {imagenFiles.map((img, idx) => (
        <div
          key={idx}
          style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
        >
          <input
            type="file"
            name="imagenFiles"
            data-idx={idx}
            onChange={handleChange}
            style={{ flex: 1 }}
          />
          {img.ruta_imagen && (
            <span style={{ marginLeft: 8 }}>{img.ruta_imagen}</span>
          )}
          <button
            type="button"
            onClick={() => removeImagenField(idx)}
            disabled={imagenFiles.length === 1}
            style={{ marginLeft: 8 }}
          >
            – Quitar Imagen
          </button>
        </div>
      ))}
      <button type="button" onClick={addImagenField}>+ Añadir imagen</button>
      <div style={{ marginBottom: 10 }}></div>

      {/* Preview (siempre uno) */}
      <label>Preview actual:</label>
      {form.ruta_preview
        ? (
          <div style={{ marginBottom: 10 }}>
            <span>{form.ruta_preview}</span>
            <button
              type="button"
              style={{ marginLeft: 8 }}
              onClick={() => setForm(prev => ({ ...prev, ruta_preview: '' }))}
            >
              Cambiar archivo
            </button>
          </div>
        )
        : (
          <div style={{ marginBottom: 10 }}>
            <input
              type="file"
              name="ruta_preview"
              onChange={handleChange}
            />
          </div>
        )
      }

      {/* Modelo (opcional) */}
      <label>Archivo Modelo:</label>
      {modelo.ruta_modelo
        ? (
          <div style={{ marginBottom: 10 }}>
            <span>{modelo.ruta_modelo}</span>
            <button
              type="button"
              style={{ marginLeft: 8 }}
              onClick={() => setModelo(prev => ({ ...prev, ruta_modelo: '' }))}
            >
              Cambiar archivo
            </button>
          </div>
        )
        : (
          <div style={{ marginBottom: 10 }}>
            <input
              type="file"
              name="ruta_modelo"
              onChange={handleChange}
            />
          </div>
        )
      }

      {/* Fondo (opcional) */}
      <label>Archivo Fondo:</label>
      {modelo.ruta_fondo
        ? (
          <div style={{ marginBottom: 10 }}>
            <span>{modelo.ruta_fondo}</span>
            <button
              type="button"
              style={{ marginLeft: 8 }}
              onClick={() => setModelo(prev => ({ ...prev, ruta_fondo: '' }))}
            >
              Cambiar archivo
            </button>
          </div>
        )
        : (
          <div style={{ marginBottom: 10 }}>
            <input
              type="file"
              name="ruta_fondo"
              onChange={handleChange}
            />
          </div>
        )
      }

      <div style={{ marginBottom: 50 }}></div>
      <button type="submit">Actualizar Objeto</button>

      <button
        type="button"
        onClick={handleDelete}
        style={{ marginLeft: '100px' }}
      >
        Eliminar Objeto
      </button>
    </form>
  );
};

export default EditObject;
