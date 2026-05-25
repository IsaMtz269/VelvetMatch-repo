// backend/routes/citaRoutes.js
const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

// Ruta base: /api/citas
router.post('/', citaController.crearCita);
router.post('/:id_cita/resena', citaController.agregarResena); 

router.get('/negocio/:id_negocio', citaController.obtenerCitasPorNegocio);
router.get('/empleado/:id_empleado', citaController.obtenerCitasPorEmpleado);
router.get('/cliente/:id_cliente', citaController.obtenerCitasPorCliente);
router.get('/resenas/negocio/:id_negocio', citaController.obtenerResenasPorNegocio); 


router.patch('/aprobar/:id_cita', citaController.aprobarCita);
router.patch('/cancelar/:id_cita', citaController.cancelarCita);
router.patch('/completar/:id_cita', citaController.completarCita);

router.put('/:id/aceptar', citaController.aceptarCita);
router.put('/:id/rechazar', citaController.rechazarCita);

module.exports = router;