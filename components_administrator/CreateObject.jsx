import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const CreateObject = () => {
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

  useEffect(() => {
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
      }
    };
    fetchData();
  }, []);

  // Reemplaza tu handleChange actual por esta función:

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Para campos dinámicos de video_urls e imagen_archivos:
    if (name === 'video_urls') {
      // dataset.index viene de data-index en el <input>
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
      const filename = files[0]?.name || '';
      setFormData(prev => {
        const arr = [...prev.imagen_archivos];
        arr[idx] = filename;
        return { ...prev, imagen_archivos: arr };
      });
      return;
    }

    // Para inputs tipo file únicos (preview, modelo, fondo):
    if (type === 'file' && ['ruta_preview','modelo_archivo','fondo_archivo'].includes(name)) {
      const filename = files[0]?.name || '';
      setFormData(prev => ({ ...prev, [name]: filename }));
      return;
    }

    // Campos de texto/URL normales:
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  // Videos
  const addVideoField = () => {
    setFormData(prev => ({ ...prev, video_urls: [...prev.video_urls, ''] }));
  };
  const removeVideoField = idx => {
    setFormData(prev => ({
      ...prev,
      video_urls: prev.video_urls.filter((_, i) => i !== idx)
    }));
  };

  // Imágenes
  const addImagenField = () => {
    setFormData(prev => ({ ...prev, imagen_archivos: [...prev.imagen_archivos, ''] }));
  };
  const removeImagenField = idx => {
    setFormData(prev => ({
      ...prev,
      imagen_archivos: prev.imagen_archivos.filter((_, i) => i !== idx)
    }));
  };



  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones antes de enviar:
    const cantidadVideosValidos = formData.video_urls.filter(url => url.trim() !== '').length;
    const cantidadImagenesValidas = formData.imagen_archivos.filter(img => img.trim() !== '').length;
    const cantidadPreview = formData.ruta_preview;


    if (!cantidadPreview) { // Esta nulo?
      alert('Debe subir al menos una imagen preview.');
      return;
    }

    // Regla 1: debe haber al menos 1 video
    if (cantidadVideosValidos < 1) {
      alert('Debe ingresar al menos una URL de video.');
      return;
    }

    // Regla 2: debe haber al menos 1 imagen
    if (cantidadImagenesValidas < 1) {
      alert('Debe subir al menos una imagen.');
      return;
    }

    // Regla 3: si se sube modelo, también se debe subir fondo, y viceversa
    const modelo = formData.modelo_archivo;
    const fondo = formData.fondo_archivo;

    if ((modelo && !fondo) || (!modelo && fondo)) {
      alert('Debe subir tanto el modelo como el fondo, o ninguno de los dos.');
      return;
    }

    // Si pasó validación, continuar con POST
    try {
      const res = await axios.post('http://localhost:3000/api/objetos', formData);
      const objetoCreado = res.data;

      // Videos
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

      // Imágenes
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

      // Modelo + fondo (solo si ambos están presentes)
      if (modelo && fondo) {
        await axios.post('http://localhost:3000/api/modelos', {
          ruta_modelo: modelo,
          ruta_fondo: fondo,
          OBJETO_id: objetoCreado.id
        });
      }

      alert('Objeto, video, imagen y modelo creados correctamente');
      navigate('/gallery');
    } catch (error) {
      console.error('Error al crear alguno de los elementos:', error);
      alert('Error al crear alguno de los elementos');
    }
  };




  return (
    <form onSubmit={handleSubmit}>
    <div style={{ marginBottom: 100 }}>
         
        </div>
      <h2>Crear Objeto</h2>
<div style={{ marginBottom: 50 }}>
         
        </div>
      <label>Nombre:</label>
      <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
      <div style={{ marginBottom: 10 }}>
         
        </div>
      <label>Descripción:</label>
      <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />
      <div style={{ marginBottom: 10 }}>
         
        </div>
      <label>Fecha de Creación:</label>
      <input type="date" name="fecha_creacion" value={formData.fecha_creacion} onChange={handleChange} required />
      <div style={{ marginBottom: 10 }}>
         
        </div>
      <label>Valor Histórico:</label>
      <textarea name="valor_historico" value={formData.valor_historico} onChange={handleChange} required />
      
      <div style={{ marginBottom: 10 }}>
         
        </div>
      <label>Nro. Visitas:</label>
      <input type="number" name="nro_visitas" value={formData.nro_visitas} onChange={handleChange} required />
      <div style={{ marginBottom: 10 }}>
         
        </div>
      <label>Imagen Preview:</label>
      <input type="file" name="ruta_preview" onChange={handleChange} />
      <div style={{ marginBottom: 10 }}>
         
        {/* Video URLs dinámicos */}
        <label>URL VIDEO:</label>
        {formData.video_urls.map((url, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <input
              type="url"
              name="video_urls"
              data-index={idx}
              value={url}
              onChange={handleChange}
              placeholder="https://..."
            />
            <button type="button" onClick={() => removeVideoField(idx)}>- Quitar Video</button>
          </div>
        ))}
        <button type="button" onClick={addVideoField}>+ Añadir Video</button>

         
        </div>
      {/* Selects dinámicos */}
      <label>Época:</label>
      <select name="epoca_id" value={formData.epoca_id} onChange={handleChange} required>
        <option value="">Seleccione una época</option>
        {selectData.epocas.map(e => (
          <option key={e.id} value={e.id}>{e.nombre_epoca}</option>
        ))}
      </select>
<div style={{ marginBottom: 10 }}>
         
        </div>
      <label>Ubicación Actual:</label>
      <select name="ubicacion_actual_id" value={formData.ubicacion_actual_id} onChange={handleChange} required>
        <option value="">Seleccione una ubicación</option>
        {selectData.ubicaciones.map(u => (
          <option key={u.id} value={u.id}>{u.pais + " --- " + u.museo}</option>
        ))}
      </select>
<div style={{ marginBottom: 10 }}>
         
        </div>
      <label>Estado de Conservación:</label>
      <select name="estado_conservacion_id" value={formData.estado_conservacion_id} onChange={handleChange} required>
        <option value="">Seleccione un estado</option>
        {selectData.estados.map(e => (
          <option key={e.id} value={e.id}>{e.estado}</option>
        ))}
      </select>
<div style={{ marginBottom: 10 }}>
         
        </div>
      <label>Procedencia:</label>
      <select name="procedencia_id" value={formData.procedencia_id} onChange={handleChange} required>
        <option value="">Seleccione una procedencia</option>
        {selectData.procedencias.map(p => (
          <option key={p.id} value={p.id}>{p.nombre_region}</option>
        ))}
      </select>
<div style={{ marginBottom: 10 }}>
         
        </div>
      <label>Categoría:</label>
      <select name="categoria_id" value={formData.categoria_id} onChange={handleChange} required>
        <option value="">Seleccione una categoría</option>
        {selectData.categorias.map(c => (
          <option key={c.id} value={c.id}>{c.categoria}</option>
        ))}
      </select>
<div style={{ marginBottom: 10 }}>
         
        </div>
      <label>Autor:</label>
      <select name="autor_id" value={formData.autor_id} onChange={handleChange} required>
        <option value="">Seleccione un autor</option>
        {selectData.autores.map(a => (
          <option key={a.id} value={a.id}>{a.nombre}</option>
        ))}
      </select>
      <div style={{ marginBottom: 10 }}></div>


      <label>Ruta Imagen:</label>
      {/* Imágenes dinámicas */}
      {formData.imagen_archivos.map((img, idx) => (
        <div key={idx} style={{ marginBottom: 10 }}>
          <input
            type="file"
            name="imagen_archivos"
            data-index={idx}
            onChange={handleChange}
          />
          {img && <span style={{ marginLeft: 8 }}>{img}</span>}
          <button type="button" onClick={() => removeImagenField(idx)}>- Quitar Imagen</button>
        </div>
      ))}
      <button type="button" onClick={addImagenField}>+ Añadir Imagen</button>

      <div style={{ marginBottom: 50 }}></div>

      <label>Archivo Modelo:</label>
      <input type="file" name="modelo_archivo" onChange={handleChange} />
      <div style={{ marginBottom: 10 }}></div>

      <label>Archivo Fondo:</label>
      <input type="file" name="fondo_archivo" onChange={handleChange} />
      <div style={{ marginBottom: 10 }}></div>



<div style={{ marginBottom: 50 }}>
         
        </div>
      <button type="submit">Crear Objeto</button>
    </form>
  );
};

export default CreateObject;
