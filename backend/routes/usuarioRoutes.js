// backend/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// La ruta base será /api/usuarios, así que aquí solo ponemos /empleados
router.get('/', usuarioController.obtenerTodosUsuarios);
router.post('/empleados', usuarioController.crearEmpleado);
router.get('/empleados/negocio/:id_negocio', usuarioController.obtenerEmpleadosPorNegocio);
router.put('/:id', usuarioController.actualizarUsuario);

module.exports = router;