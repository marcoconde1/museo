const connection = require('../db');
const Modelo = require('../models/modelo.model');

// Obtener todos los modelos
async function getAllModelos() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM MODELO', (err, results) => {
      if (err) {
        reject(err);
      } else {
        //console.log(results[0]); 
        resolve(results.map(row => new Modelo(row.ruta_modelo, row.ruta_fondo, row.OBJETO_id)));
      }
    });
  });
}

// Crear un modelo
async function createModelo(modelo) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO MODELO (ruta_modelo, ruta_fondo, OBJETO_id) VALUES (?, ?, ?)';
    connection.query(query, [modelo.ruta_modelo, modelo.ruta_fondo, modelo.OBJETO_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Eliminar un modelo por su id
async function deleteModeloById(objetoId) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM MODELO WHERE OBJETO_id = ?', [objetoId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.affectedRows > 0);
      }
    });
  });
}

// Obtener un modelo por su OBJETO_id
async function getModeloById(objetoId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM MODELO WHERE OBJETO_id = ?';
      connection.query(query, [objetoId], (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          resolve(null); // No se encontró modelo
        } else {
          const row = results[0];
          resolve(new Modelo(row.ruta_modelo, row.ruta_fondo, row.OBJETO_id));
        }
      });
    });
  }

  
  async function updateModeloRutas(objeto_id, ruta_modelo, ruta_fondo) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE MODELO SET ruta_modelo = ?, ruta_fondo = ? WHERE OBJETO_id = ?';
    connection.query(query, [ruta_modelo, ruta_fondo, objeto_id], (err, result) => {
      if (err) return reject(err);
      resolve({ objeto_id, ruta_modelo, ruta_fondo });
    });
  });
}


module.exports = { getAllModelos, createModelo, deleteModeloById, getModeloById,  updateModeloRutas};
