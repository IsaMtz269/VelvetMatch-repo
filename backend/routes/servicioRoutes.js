// backend/routes/servicioRoutes.js
const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

// La ruta base será /api/servicios
router.post('/', servicioController.crearServicio);
router.delete('/:id', servicioController.eliminarServicio);
router.get('/negocio/:id_negocio', servicioController.obtenerServiciosPorNegocio);

module.exports = router;