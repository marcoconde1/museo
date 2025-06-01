const connection = require('../db');
const Objeto = require('../models/objeto.model');

async function getAllObjetos() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM OBJETO', (err, results) => {
      if (err) return reject(err);
      resolve(results.map(row => new Objeto(
        row.id, row.nombre, row.descripcion, row.fecha_creacion,
        row.valor_historico, row.nro_visitas, row.ruta_preview,
        row.EPOCA_id, row.UBICACION_ACTUAL_id, row.ESTADO_CONSERVACION_id,
        row.PROCEDENCIA_id, row.CATEGORIA_id, row.AUTOR_id
      )));
    });
  });
}

async function createObjeto(data) {
  const {
    nombre, descripcion, fecha_creacion, valor_historico, nro_visitas,
    ruta_preview, epoca_id, ubicacion_actual_id, estado_conservacion_id,
    procedencia_id, categoria_id, autor_id
  } = data;

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO OBJETO
      (nombre, descripcion, fecha_creacion, valor_historico, nro_visitas, ruta_preview,
      EPOCA_id, UBICACION_ACTUAL_id, ESTADO_CONSERVACION_id, PROCEDENCIA_id, CATEGORIA_id, AUTOR_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      nombre, descripcion, fecha_creacion, valor_historico, nro_visitas, ruta_preview,
      epoca_id, ubicacion_actual_id, estado_conservacion_id, procedencia_id, categoria_id, autor_id
    ];

    connection.query(query, values, (err, result) => {
      if (err) return reject(err);
      // Aquí sí puedes devolver el ID generado automáticamente
      resolve({ id: result.insertId });
    });
  });
}


async function deleteObjeto(id) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM OBJETO WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);
      resolve({ message: `Objeto con ID ${id} eliminado.` });
    });
  });
}

async function getObjetoById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM OBJETO WHERE id = ?';
      connection.query(query, [id], (err, results) => {
        if (err) return reject(err);
  
        if (results.length === 0) {
          resolve(null); 
        } else {
          const row = results[0];
          resolve(new Objeto(
            row.id, row.nombre, row.descripcion, row.fecha_creacion,
            row.valor_historico, row.nro_visitas, row.ruta_preview,
            row.EPOCA_id, row.UBICACION_ACTUAL_id, row.ESTADO_CONSERVACION_id,
            row.PROCEDENCIA_id, row.CATEGORIA_id, row.AUTOR_id
          ));
        }
      });
    });
  }
  
async function updateObjeto(id, data) {
  return new Promise((resolve, reject) => {
    const {
      nombre,
      descripcion,
      fecha_creacion,
      valor_historico,
      nro_visitas,
      ruta_preview,
      epoca_id,
      ubicacion_actual_id,
      estado_conservacion_id,
      procedencia_id,
      categoria_id,
      autor_id
    } = data;

    const query = `
      UPDATE OBJETO SET
        nombre = ?,
        descripcion = ?,
        fecha_creacion = ?,
        valor_historico = ?,
        nro_visitas = ?,
        ruta_preview = ?,
        EPOCA_id = ?,
        UBICACION_ACTUAL_id = ?,
        ESTADO_CONSERVACION_id = ?,
        PROCEDENCIA_id = ?,      
        CATEGORIA_id = ?,
        AUTOR_id = ?
      WHERE id = ?`;

    const values = [
      nombre,
      descripcion,
      fecha_creacion,
      valor_historico,
      nro_visitas,
      ruta_preview,
      epoca_id,
      ubicacion_actual_id,
      estado_conservacion_id,
      procedencia_id,
      categoria_id,
      autor_id,
      id
    ];

    connection.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve({ message: `Objeto con id ${id} actualizado.` });
    });
  });
}



module.exports = {
  getAllObjetos,
  createObjeto,
  deleteObjeto,
  getObjetoById,
  updateObjeto
};
