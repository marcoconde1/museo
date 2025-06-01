const express = require('express');
const router = express.Router();
const modeloService = require('../services/modelo.service');
const { modeloToDTO } = require('../dto/modelo.dto');

// Obtener todos los modelos
router.get('/modelos', async (req, res) => {
  try {
    const modelos = await modeloService.getAllModelos();
    //res.json(modelos.map(modeloToDTO));
    res.json(modelos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener modelos', error: err });
  }
});

// Crear un modelo
router.post('/modelos', async (req, res) => {
  try {
    const { ruta_modelo, ruta_fondo, OBJETO_id } = req.body;
    const nuevoModelo = { ruta_modelo, ruta_fondo, OBJETO_id };
    await modeloService.createModelo(nuevoModelo);
    res.status(201).json({ message: 'Modelo creado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el modelo', error: err });
  }
});

// Eliminar un modelo
router.delete('/modelos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await modeloService.deleteModeloById(id);
    if (result) {
      res.status(200).json({ message: 'Modelo eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Modelo no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el modelo', error: err });
  }
});

// Obtener un modelo por OBJETO_id
router.get('/modelos/:id', async (req, res) => {
    try {
      const modelo = await modeloService.getModeloById(req.params.id);
      if (modelo) {
        res.json(modelo);
      } else {
        res.status(404).json({ message: 'Modelo no encontrado' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener modelo' });
    }
  });

router.put('/modelos/:objeto_id', async (req, res) => {
  try {
    const { objeto_id } = req.params;
    const { ruta_modelo, ruta_fondo } = req.body;
    const updated = await modeloService.updateModeloRutas(objeto_id, ruta_modelo, ruta_fondo);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
