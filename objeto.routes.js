const express = require('express');
const router = express.Router();
const objetoService = require('../services/objeto.service');

// Obtener todos los objetos
router.get('/objetos', async (req, res) => {
  try {
    const objetos = await objetoService.getAllObjetos();
    res.json(objetos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener objetos' });
  }
});

// Crear un nuevo objeto
router.post('/objetos', async (req, res) => {
  try {
    const nuevo = await objetoService.createObjeto(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear objeto' });
  }
});


// Eliminar objeto por ID
router.delete('/objetos/:id', async (req, res) => {
  try {
    const resultado = await objetoService.deleteObjeto(req.params.id);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar objeto' });
  }
});

router.get('/objetos/:id', async (req, res) => {
    try {
      const objeto = await objetoService.getObjetoById(req.params.id);
      if (objeto) {
        res.json(objeto);
      } else {
        res.status(404).json({ message: 'Objeto no encontrado' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener el objeto' });
    }
  });

router.put('/objetos/:id', async (req, res) => {
try {
const result = await objetoService.updateObjeto(req.params.id, req.body);
res.json(result);
} catch (err) {
res.status(500).json({ error: err.message });
}
});
  

module.exports = router;
