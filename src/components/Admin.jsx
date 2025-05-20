import React, { useEffect, useState } from 'react';
import TablaSelector from './TablaSelector';
import TablaDatos from './TablaDatos';
import CrearFormulario from './CrearFormulario';

const tablas = [
  'autores', 'categorias', 'epocas', 'estados', 'imagenes', 'objetos',
  'procedencias', 'ubicaciones', 'usuarios', 'videos', 'modelos'
];

export default function Admin() {
  const [tablaActual, setTablaActual] = useState('');
  const [datos, setDatos] = useState([]);
  const [nuevoDato, setNuevoDato] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [editandoDato, setEditandoDato] = useState({});
  const [columnas, setColumnas] = useState([]); // <-- agrega esta línea


  const fetchDatos = () => {
    fetch(`http://localhost:3000/api/${tablaActual}`)
      .then(res => res.json())
      .then(setDatos)
      .catch(console.error);
  };

  useEffect(() => {
    if (tablaActual) {
      fetchDatos();
      setNuevoDato({});
      setEditandoId(null);
      setEditandoDato({});
      setColumnas([]);
    }
  }, [tablaActual]);



  useEffect(() => {
    if (datos.length > 0) {
      const campos = {};
      Object.keys(datos[0]).forEach(key => {
        if (key !== 'id') campos[key] = '';
      });
      setNuevoDato(campos);
    } else if (tablaActual) {
      if (tablaActual === 'imagenes' || tablaActual === 'modelos') {
        setNuevoDato({ ruta: '', OBJETO_id: '' });
      } else if (tablaActual === 'videos') {
        setNuevoDato({ url: '', OBJETO_id: '' });
      } else {
        setNuevoDato({ nombre: '' });
      }
    }
  }, [datos, tablaActual]);

  const handleCrear = () => {
    const camposInvalidos = Object.entries(nuevoDato).filter(([key, value]) => {
    if (key === 'id') return false; // puedes permitir el id como 0 si es autoincremental
    if (typeof value === 'string') return value.trim() === '';
    if (typeof value === 'number') return value === 0;
    return value === null || value === undefined;
  });


    if (camposVacios.length > 0) {
      alert('Por favor, completa todos los campos obligatorios antes de crear un nuevo registro.');
      return;
    }

    fetch(`http://localhost:3000/api/${tablaActual}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoDato)
    })
      .then(res => res.json())
      .then(() => {
        fetchDatos();
        setNuevoDato({});
      })
      .catch(async (err) => {
        let errorMsg = 'Error desconocido al crear el registro.';
        try {
          const text = await err.text?.();
          if (text.includes('foreign key')) {
            errorMsg = 'No se puede crear el registro porque se ingresó un ID que no existe en otra tabla. Verifica las referencias.';
          } else if (text.includes('invalid input syntax for type date')) {
            errorMsg = 'Formato de fecha inválido. Usa el formato correcto: AAAA-MM-DD.';
          } else if (text.includes('violates not-null constraint')) {
            errorMsg = 'Hay campos obligatorios vacíos. Por favor completa todos los campos requeridos.';
          } else if (text.includes('violates unique constraint')) {
            errorMsg = 'Ya existe un registro con ese valor único. Intenta con otro valor.';
          } else if (text.includes('invalid input syntax')) {
            errorMsg = 'Uno de los campos contiene datos con el formato incorrecto.';
          }
        } catch (e) {
          console.error('Error al interpretar el error:', e);
        }
        alert(errorMsg);
      });
  };


  const handleEliminar = async (id) => {
    try {
      const relaciones = await Promise.all(
        tablas.map(async (tabla) => {
          const res = await fetch(`http://localhost:3000/api/${tabla}`);
          const data = await res.json();
          return data.some((fila) => Object.values(fila).includes(id)) ? tabla : null;
        })
      );

      const relacionadas = relaciones.filter((t) => t && t !== tablaActual);
      if (relacionadas.length > 0) {
        return alert(`Registro relacionado con: ${relacionadas.join(', ')}`);
      }

      if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;

      await fetch(`http://localhost:3000/api/${tablaActual}/${id}`, { method: 'DELETE' });
      setDatos(datos.filter((d) => d.id !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const handleEditar = (fila) => {
    setEditandoId(fila.id);
    setEditandoDato({ ...fila });
  };

  const handleGuardar = () => {
    fetch(`http://localhost:3000/api/${tablaActual}/${editandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editandoDato),
    })
      .then(() => {
        setEditandoId(null);
        fetchDatos();
      })
      .catch(err => alert("Error al actualizar: " + err.message));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoDato({ ...nuevoDato, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditandoDato({ ...editandoDato, [name]: value });
  };

  const handleFileUpload = (name, file) => {
    setNuevoDato({ ...nuevoDato, [name]: file.name });
  };

  const handleEditFileUpload = (name, file) => {
    setEditandoDato({ ...editandoDato, [name]: file.name });
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setEditandoDato({});
    fetchDatos(); 
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      <TablaSelector
        tablaActual={tablaActual}
        setTablaActual={setTablaActual}
        tablas={tablas}
      />

      {tablaActual && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">
            Datos en {tablaActual.toUpperCase()}
          </h2>

          <TablaDatos
            datos={datos}
            tablaActual={tablaActual}
            editandoId={editandoId}
            editandoDato={editandoDato}
            handleEditar={handleEditar}
            handleGuardar={handleGuardar}
            handleEliminar={handleEliminar}
            handleEditChange={handleEditChange}
            handleEditFileUpload={handleEditFileUpload}
          />

          <h3 className="text-lg font-semibold mb-2">Crear nuevo registro</h3>
          <CrearFormulario
            nuevoDato={nuevoDato}
            handleChange={handleChange}
            handleCrear={handleCrear}
            handleFileUpload={handleFileUpload}
            tablaActual={tablaActual}
          />
        </>
      )}
    </div>
  );
}
