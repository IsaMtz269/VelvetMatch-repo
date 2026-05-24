// backend/routes/fechaProhibidaRoutes.js
const express = require('express');
const router = express.Router();
const fechaProhibidaController = require('../controllers/fechaProhibidaController');

// Ruta base: /api/fechas-prohibidas
router.post('/', fechaProhibidaController.bloquearFecha);
router.get('/negocio/:id_negocio', fechaProhibidaController.obtenerFechasProhibidas);

module.exports = router;