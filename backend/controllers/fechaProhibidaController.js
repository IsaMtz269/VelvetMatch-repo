// backend/controllers/fechaProhibidaController.js
const FechaProhibida = require('../models/FechaProhibida');
const Negocio = require('../models/Negocio');
const Cita = require('../models/Cita'); // <-- IMPORTACIÓN NUEVA Y NECESARIA

// 1. Bloquear una fecha (Día Festivo, Vacaciones, etc.)
exports.bloquearFecha = async (req, res) => {
    try {
        const { id_negocio, fecha_f, razon_f, rol_usuario } = req.body;

        // VALIDACIÓN 1: Solo el Admin puede bloquear fechas
        if (rol_usuario !== 'admin' && rol_usuario !== 'superadmin') {
            return res.status(403).json({ message: 'Acceso denegado. Solo el administrador puede bloquear fechas.' });
        }

        if (!id_negocio || !fecha_f || !razon_f) {
            return res.status(400).json({ message: 'Faltan campos obligatorios para bloquear la fecha' });
        }

        // VALIDACIÓN 2: No se pueden bloquear fechas del pasado
        // Convertimos ambas a fechas de JavaScript a las 00:00 para hacer una comparación justa
        const fechaBloqueo = new Date(fecha_f + 'T00:00:00');
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaBloqueo < hoy) {
            return res.status(400).json({ message: 'No es posible bloquear fechas anteriores al día de hoy.' });
        }

        const negocio = await Negocio.findById(id_negocio);
        if (!negocio) {
            return res.status(404).json({ message: 'Negocio no encontrado' });
        }

        // VALIDACIÓN 3: No bloquear si ya hay citas en ese día
        // (Excluimos las que ya están canceladas o rechazadas porque esas no importan)
        const citasEseDia = await Cita.find({ 
            id_negocio: id_negocio, 
            fecha: fecha_f,
            estado: { $nin: ['cancelada', 'rechazada'] } 
        });

        if (citasEseDia.length > 0) {
            return res.status(400).json({ 
                message: `No puedes bloquear esta fecha porque tienes ${citasEseDia.length} cita(s) activa(s) agendada(s) para ese día.` 
            });
        }

        const nuevaFechaProhibida = new FechaProhibida({
            id_negocio,
            fecha_f,
            razon_f
        });

        await nuevaFechaProhibida.save();

        res.status(201).json({ 
            message: 'Día cerrado exitosamente. Los clientes no podrán agendar citas en esta fecha.', 
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