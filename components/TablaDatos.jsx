import React from 'react';

export default function TablaDatos({
  datos,
  tablaActual,
  editandoId,
  editandoDato,
  handleEditar,
  handleGuardar,
  handleEliminar,
  handleEditChange,
  handleEditFileUpload,
}) {
  return (
    <>
      {datos.length > 0 ? (
        <table className="w-full border mb-4">
          <thead>
            <tr>
              {Object.keys(datos[0]).map((col) => (
                <th key={col} className="border p-2">
                  {col}
                </th>
              ))}
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((fila) => (
              <tr key={fila.id}>
                {Object.keys(fila).map((key) => (
                  <td key={key} className="border p-2">
                    {editandoId === fila.id && key !== 'id' ? (
                      key.toLowerCase().includes('ruta') && tablaActual !== 'videos' ? (
                        <input
                          type="file"
                          onChange={(e) => handleEditFileUpload(key, e.target.files[0])}
                          className="p-1 border rounded w-full"
                        />
                      ) : (
                        <input
                          type="text"
                          name={key}
                          value={editandoDato[key]}
                          onChange={handleEditChange}
                          className="p-1 border rounded w-full"
                        />
                      )
                    ) : (
                      fila[key]
                    )}
                  </td>
                ))}
                <td className="border p-2">
                  {editandoId === fila.id ? (
                    <button
                      onClick={handleGuardar}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditar(fila)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar
                    </button>
                  )}
                  <button
                    onClick={() => handleEliminar(fila.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mb-4 text-gray-600">No hay datos en esta tabla.</p>
      )}
    </>
  );
}
