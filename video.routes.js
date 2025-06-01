const express = require('express');
const router = express.Router();
const videoService = require('../services/video.service');

// Obtener todos los videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await videoService.getAllVideos();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener videos' });
  }
});

// Crear un nuevo video
router.post('/videos', async (req, res) => {
  try {
    const nuevo = await videoService.createVideo(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear video' });
  }
});

// Eliminar videos por objeto_id
router.delete('/videos/:objeto_id', async (req, res) => {
  try {
    const resultado = await videoService.deleteVideo(req.params.objeto_id);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar video' });
  }
});

// GET videos por OBJETO_id
router.get('/videos/:objeto_id', async (req, res) => {
    try {
      const videos = await videoService.getVideosByObjetoId(req.params.objeto_id);
      if (videos.length) {
        res.json(videos);
      } else {
        res.status(404).json({ message: 'No se encontraron videos para este objeto' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener videos', error: err.message });
    }
  });

router.put('/videos/:id', async (req, res) => {
  try {
    const { ruta_video } = req.body;
    if (!ruta_video) return res.status(400).json({ error: 'Falta ruta_video en el cuerpo' });

    const result = await videoService.updateVideoRuta(req.params.id, ruta_video);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/videos/id/:id', async (req, res) => {
  try {
    const videoId = req.params.id;
    const resultado = await videoService.deleteVideoById(videoId);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar video por su id', error: err.message });
  }
});



module.exports = router;
