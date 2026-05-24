// backend/routes/negocioRoutes.js
const express = require('express');
const router = express.Router();
const negocioController = require('../controllers/negocioController');

// La ruta base será /api/negocios, así que aquí solo ponemos "/" o "/:id"
router.post('/', negocioController.crearNegocio);
router.get('/', negocioController.obtenerNegocios);
router.get('/:id', negocioController.obtenerNegocioPorId);
router.put('/:id', negocioController.actualizarNegocio);

module.exports = router;