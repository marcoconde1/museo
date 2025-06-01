const express = require('express');
const router = express.Router();
const imagenService = require('../services/imagen.service');

// GET todas las imágenes
router.get('/imagenes', async (req, res) => {
  try {
    const imagenes = await imagenService.getAllImagenes();
    res.json(imagenes);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener imágenes' });
  }
});

// POST agregar una imagen
router.post('/imagenes', async (req, res) => {
  try {
    const nueva = await imagenService.createImagen(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear imagen' });
  }
});

// DELETE eliminar imágenes por objeto_id
router.delete('/imagenes/:objeto_id', async (req, res) => {
  try {
    const resultado = await imagenService.deleteImagen(req.params.objeto_id);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar imagen' });
  }
});

router.get('/imagenes/:objeto_id', async (req, res) => {
    try {
      const imagenes = await imagenService.getImagenesByObjetoId(req.params.objeto_id);
      if (imagenes.length > 0) {
        res.json(imagenes); // Si se encontraron imágenes, las devolvemos
      } else {
        res.status(404).json({ message: 'No se encontraron imágenes para este objeto' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener las imágenes' });
    }
  });
  
router.put('/imagenes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ruta_imagen } = req.body;
    const result = await imagenService.updateImagenRuta(id, ruta_imagen);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/imagenes/id/:id', async (req, res) => {
  try {
    const imagenId = req.params.id;
    const resultado = await imagenService.deleteImagenById(imagenId);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar imagen por su id', error: err.message });
  }
});

  module.exports = router;