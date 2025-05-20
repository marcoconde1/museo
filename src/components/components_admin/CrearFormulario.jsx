import React from 'react';

export default function CrearFormulario({ nuevoDato, handleChange, handleCrear, handleFileUpload, tablaActual }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.keys(nuevoDato).map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium">{key}</label>
          {key.toLowerCase().includes('ruta') && tablaActual !== 'videos' ? (
            <input
              type="file"
              onChange={(e) => handleFileUpload(key, e.target.files[0])}
              className="p-2 border rounded w-full"
            />
          ) : (
            <input
              type="text"
              name={key}
              value={nuevoDato[key]}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          )}
        </div>
      ))}
      <button
        onClick={handleCrear}
        className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Crear
      </button>
    </div>
  );
}
