// backend/controllers/fechaProhibidaController.js
const FechaProhibida = require('../models/FechaProhibida');
const Negocio = require('../models/Negocio');

// 1. Bloquear una fecha (Día Festivo, Vacaciones, etc.)
exports.bloquearFecha = async (req, res) => {
    try {
        const { id_negocio, fecha_f, razon_f } = req.body;

        if (!id_negocio || !fecha_f || !razon_f) {
            return res.status(400).json({ message: 'Faltan campos obligatorios para bloquear la fecha' });
        }

        const negocio = await Negocio.findById(id_negocio);
        if (!negocio) {
            return res.status(404).json({ message: 'Negocio no encontrado' });
        }

        const nuevaFechaProhibida = new FechaProhibida({
            id_negocio,
            fecha_f,
            razon_f
        });

        await nuevaFechaProhibida.save();

        res.status(201).json({ 
            message: 'Día cerrado exitosamente. Nadie podrá agendar citas en esta fecha.', 
            fecha_bloqueada: nuevaFechaProhibida 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al bloquear la fecha', error: error.message });
    }
};

// 2. Obtener Fechas Prohibidas de un negocio
exports.obtenerFechasProhibidas = async (req, res) => {
    try {
        const { id_negocio } = req.params;
        const fechas = await FechaProhibida.find({ id_negocio: id_negocio });
        
        res.status(200).json(fechas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las fechas prohibidas', error: error.message });
    }
};