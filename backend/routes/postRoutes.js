// backend/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// La ruta base será /api/posts
router.post('/', postController.crearPost);
router.delete('/:id', postController.eliminarPost);
router.get('/negocio/:id_negocio', postController.obtenerPostsPorNegocio);

module.exports = router;