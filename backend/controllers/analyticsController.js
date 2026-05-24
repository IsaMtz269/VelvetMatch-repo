// backend/controllers/analyticsController.js
const Cita = require('../models/Cita');
const Negocio = require('../models/Negocio');
const Usuario = require('../models/Usuario');

// 1. Analytics del Negocio (Dashboard Admin)
exports.obtenerAnalyticsNegocio = async (req, res) => {
    try {
        const { id_negocio } = req.params;

        const citasCompletadas = await Cita.find({ 
            id_negocio: id_negocio, 
            estado: 'completada' 
        });

        const totalCitas = citasCompletadas.length;
        const ingresosTotales = citasCompletadas.reduce((acc, cita) => acc + (cita.precio_final || 0), 0);

        res.status(200).json({
            id_negocio,
            totalCitas,
            ingresosTotales,
            moneda: 'MXN'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar analytics del negocio', error: error.message });
    }
};

// 2. Analytics Global (Panel Super Administrador)
exports.obtenerAnalyticsGlobal = async (req, res) => {
    try {
        const totalEmpresas = await Negocio.countDocuments();
        const totalUsuarios = await Usuario.countDocuments();
        const totalOperaciones = await Cita.countDocuments();

        res.status(200).json({
            plataforma: 'Velvet Match',
            totalEmpresas,
            totalUsuarios,
            totalOperaciones,
            mensaje: 'Estadísticas globales de la plataforma'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar analytics globales', error: error.message });
    }
};