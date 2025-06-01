const connection = require('../db');
const Video = require('../models/video.model');

async function getAllVideos() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM VIDEO', (err, results) => {
      if (err) return reject(err);
      resolve(results.map(row => new Video(row.ruta_video, row.OBJETO_id, row.id)));
    });
  });
}

async function createVideo(data) {
  return new Promise((resolve, reject) => {
    const { ruta_video, objeto_id } = data;
    connection.query(
      'INSERT INTO VIDEO (ruta_video, OBJETO_id) VALUES (?, ?)',
      [ruta_video, objeto_id],
      (err, result) => {
        if (err) return reject(err);
        resolve({ ruta_video, objeto_id });
      }
    );
  });
}


async function deleteVideo(objeto_id) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM VIDEO WHERE OBJETO_id = ?', [objeto_id], (err, result) => {
      if (err) return reject(err);
      resolve({ message: `Videos del objeto ${objeto_id} eliminados.` });
    });
  });
}

// Obtener videos por OBJETO_id
async function getVideosByObjetoId(objeto_id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM VIDEO WHERE OBJETO_id = ?';
    connection.query(query, [objeto_id], (err, results) => {
      if (err) return reject(err);
      // Si no hay resultados, devolvemos arreglo vacío
      const videos = results.map(row => new Video(row.ruta_video, row.OBJETO_id, row.id));
      resolve(videos);
    });
  });
}

async function updateVideoRuta(id, nuevaRuta) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE VIDEO SET ruta_video = ? WHERE id = ?';
    connection.query(query, [nuevaRuta, id], (err, result) => {
      if (err) return reject(err);
      resolve({ message: `Video con id ${id} actualizado con nueva ruta.` });
    });
  });
}

async function deleteVideoById(videoId) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM VIDEO WHERE id = ?';
    connection.query(query, [videoId], (err, result) => {
      if (err) return reject(err);
      resolve({ message: `Video con ID ${videoId} eliminado.` });
    });
  });
}


module.exports = {
  getAllVideos,
  createVideo,
  deleteVideo,
  getVideosByObjetoId,
  updateVideoRuta,
  deleteVideoById
};
