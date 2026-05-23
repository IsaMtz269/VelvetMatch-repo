// backend/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Ruta base: /api/analytics
router.get('/negocio/:id_negocio', analyticsController.obtenerAnalyticsNegocio);
router.get('/global', analyticsController.obtenerAnalyticsGlobal);

module.exports = router;