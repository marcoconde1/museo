import React from 'react';

export default function TablaSelector({ tablaActual, setTablaActual, tablas }) {
  return (
    <label className="block mb-2">
      Selecciona una tabla:
      <select
        className="ml-2 p-2 border rounded"
        value={tablaActual}
        onChange={(e) => setTablaActual(e.target.value)}
      >
        <option value="">-- Seleccionar --</option>
        {tablas.map((tabla) => (
          <option key={tabla} value={tabla}>
            {tabla.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
