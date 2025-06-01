const connection = require('../db');
const Imagen = require('../models/imagen.model');

async function getAllImagenes() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM IMAGEN', (err, results) => {
      if (err) return reject(err);
      resolve(results.map(row => new Imagen(row.ruta_imagen, row.OBJETO_id, row.id)));
    });
  });
}

async function createImagen(data) {
  return new Promise((resolve, reject) => {
    const { ruta_imagen, objeto_id, id} = data;
    connection.query(
      'INSERT INTO IMAGEN (ruta_imagen, OBJETO_id, id) VALUES (?, ?, ?)',
      [ruta_imagen, objeto_id, id],
      (err, result) => {
        if (err) return reject(err);
        resolve({ ruta_imagen, objeto_id, id });
      }
    );
  });
}

async function deleteImagen(objeto_id) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM IMAGEN WHERE OBJETO_id = ?', [objeto_id], (err, result) => {
      if (err) return reject(err);
      resolve({ message: `Imágenes del objeto ${objeto_id} eliminadas.` });
    });
  });
}

async function getImagenesByObjetoId(objeto_id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM IMAGEN WHERE OBJETO_id = ?';
      connection.query(query, [objeto_id], (err, results) => {
        if (err) return reject(err);
  
        if (results.length === 0) {
          resolve([]); // No se encontraron imágenes, devolvemos un arreglo vacío
        } else {
          // Mapear todos los resultados a un arreglo de objetos Imagen
          const imagenes = results.map(row => new Imagen(row.ruta_imagen, row.OBJETO_id, row.id));
          resolve(imagenes);
        }
      });
    });
  }


async function updateImagenRuta(id, nuevaRuta) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE IMAGEN SET ruta_imagen = ? WHERE id = ?';
    connection.query(query, [nuevaRuta, id], (err, result) => {
      if (err) return reject(err);
      resolve({ id, nuevaRuta });
    });
  });
}

async function deleteImagenById(imagenId) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM IMAGEN WHERE id = ?';
    connection.query(query, [imagenId], (err, result) => {
      if (err) return reject(err);
      resolve({ message: `Imagen con ID ${imagenId} eliminado.` });
    });
  });
}


module.exports = {
  getAllImagenes,
  createImagen,
  deleteImagen,
  getImagenesByObjetoId,
  updateImagenRuta,
  deleteImagenById
};
