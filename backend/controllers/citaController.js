// backend/controllers/citaController.js
const Cita = require('../models/Cita');
const FechaProhibida = require('../models/FechaProhibida'); 
const Usuario = require('../models/Usuario'); // <-- AGREGAR ESTA IMPORTACIÓN

// 1. Agendar una nueva cita
exports.crearCita = async (req, res) => {
    try {
        const { 
            id_cliente, id_negocio, id_servicio, 
            fecha, hora, precio_final, anticipo_pagado 
        } = req.body;

        if (!id_cliente || !id_negocio || !id_servicio || !fecha || !hora) {
            return res.status(400).json({ message: 'Faltan campos obligatorios para agendar la cita' });
        }

        // VALIDACIÓN 1: El cliente debe existir en la base de datos (Estar registrado)
        const clienteValido = await Usuario.findById(id_cliente);
        if (!clienteValido) {
            return res.status(403).json({ message: 'Acceso denegado. Solo los clientes registrados pueden agendar citas.' });
        }

        // VALIDACIÓN 2: Mínimo 48 horas de anticipación (Tu lógica original intacta)
        const fechaHoraCita = new Date(`${fecha}T${hora}:00`); 
        const ahora = new Date();
        
        const diferenciaMilisegundos = fechaHoraCita - ahora;
        const diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60);

        if (diferenciaHoras < 48) {
            return res.status(400).json({ 
                message: 'Por políticas del negocio, las citas deben agendarse con al menos 48 horas de anticipación.' 
            });
        }

        const fechaBloqueada = await FechaProhibida.findOne({ 
            id_negocio: id_negocio, 
            fecha_f: new Date(fecha) 
        });

        if (fechaBloqueada) {
            return res.status(400).json({ 
                message: `No es posible agendar en esta fecha: ${fechaBloqueada.razon_f}` 
            });
        }

        const nuevaCita = new Cita({
            id_cliente, id_negocio, id_servicio, fecha, hora, precio_final, anticipo_pagado
        });

        await nuevaCita.save();

        res.status(201).json({ message: 'Tu cita ha sido enviada y está en revisión', cita: nuevaCita });

    } catch (error) {
        res.status(500).json({ message: 'Error al agendar la cita', error: error.message });
    }
};

// 2. Obtener citas de un Negocio (Dashboard del Admin)
exports.obtenerCitasPorNegocio = async (req, res) => {
    try {
        const citas = await Cita.find({ id_negocio: req.params.id_negocio })
            .populate('id_cliente', 'nombre apellido email')
            .populate('id_servicio', 'nombre precio duracion')
            .populate('id_empleado', 'nombre apellido');
            
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener citas del negocio', error: error.message });
    }
};

// 3. Obtener citas de un Empleado (Agenda propia)
exports.obtenerCitasPorEmpleado = async (req, res) => {
    try {
        const citas = await Cita.find({ id_empleado: req.params.id_empleado })
            .populate('id_cliente', 'nombre apellido')
            .populate('id_servicio', 'nombre duracion');
            
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener citas del empleado', error: error.message });
    }
};

// 4. Obtener citas de un Cliente (Historial de reservaciones)
exports.obtenerCitasPorCliente = async (req, res) => {
    try {
        const citas = await Cita.find({ id_cliente: req.params.id_cliente })
            .populate('id_negocio', 'nombre ubicacion celular')
            .populate('id_servicio', 'nombre precio')
            .populate('id_empleado', 'nombre apellido');
            
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener historial del cliente', error: error.message });
    }
};

// 5. APROBAR una cita administrador
exports.aprobarCita = async (req, res) => {
    try {
        const { id_empleado } = req.body;

        if (!id_empleado) {
            return res.status(400).json({ message: 'Debes seleccionar un profesional para aprobar la cita' });
        }

        const citaActualizada = await Cita.findByIdAndUpdate(
            req.params.id_cita,
            { 
                estado: 'programada', 
                id_empleado: id_empleado 
            },
            { new: true } 
        );

        if (!citaActualizada) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        res.status(200).json({ message: 'Cita aprobada y asignada con éxito', cita: citaActualizada });
    } catch (error) {
        res.status(500).json({ message: 'Error al aprobar la cita', error: error.message });
    }
};

// 6. CANCELAR / RECHAZAR una cita
exports.cancelarCita = async (req, res) => {
    try {
        const { motivo_rechazo, es_admin } = req.body;
        
        const cita = await Cita.findById(req.params.id_cita);
        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        if (!es_admin) {
            const fechaHoraCita = new Date(`${cita.fecha}T${cita.hora}:00`); 
            const ahora = new Date();
            
            const diferenciaHoras = (fechaHoraCita - ahora) / (1000 * 60 * 60);

            if (diferenciaHoras < 6 && diferenciaHoras > 0) {
                return res.status(400).json({ 
                    message: 'Por políticas de la plataforma, las cancelaciones deben realizarse con al menos 6 horas de anticipación.' 
                });
            }
            
            if (diferenciaHoras <= 0) {
                 return res.status(400).json({ message: 'No puedes cancelar una cita que ya ocurrió o está en proceso.' });
            }
        }

        cita.estado = es_admin ? 'rechazada' : 'cancelada';
        
        if (motivo_rechazo) {
            cita.motivo_rechazo = motivo_rechazo;
        }

        await cita.save();

        res.status(200).json({ 
            message: `La cita fue ${cita.estado} exitosamente`, 
            citaActualizada: cita 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al procesar la cancelación', error: error.message });
    }
};

// 9. Marcar cita como completada (Solo por el Empleado asignado)
exports.completarCita = async (req, res) => {
    try {
        const { id_cita } = req.params;
        const { id_empleado } = req.body; 

        if (!id_empleado) {
            return res.status(400).json({ message: 'Se requiere el ID del empleado para verificar permisos' });
        }

        const cita = await Cita.findById(id_cita);
        
        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        if (cita.estado !== 'programada') {
            return res.status(400).json({ 
                message: `No se puede completar una cita que actualmente tiene estado: ${cita.estado}` 
            });
        }

        if (!cita.id_empleado || cita.id_empleado.toString() !== id_empleado.toString()) {
            return res.status(403).json({ 
                message: 'Acceso denegado: Solo el empleado asignado a esta cita puede marcarla como completada' 
            });
        }

        cita.estado = 'completada';
        await cita.save();

        res.status(200).json({ 
            message: 'Cita marcada como completada exitosamente', 
            citaActualizada: cita 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al marcar la cita como completada', error: error.message });
    }
};

//RESENAS

// 7. Agregar una reseña a una cita completada
exports.agregarResena = async (req, res) => {
    try {
        const { id_cita } = req.params; 
        const { id_cliente, review_stars, review_texto } = req.body;

        if (!id_cliente || !review_stars || !review_texto) {
            return res.status(400).json({ message: 'Faltan campos obligatorios para la reseña' });
        }

        if (review_stars < 1 || review_stars > 5) {
            return res.status(400).json({ message: 'La calificación debe estar entre 1 y 5 estrellas' });
        }

        const cita = await Cita.findById(id_cita);
        if (!cita) {
            return res.status(404).json({ message: 'La cita no existe' });
        }

        if (cita.id_cliente.toString() !== id_cliente.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para reseñar una cita de otra persona' });
        }

        if (cita.estado !== 'completada') {
            return res.status(400).json({ 
                message: `No puedes reseñar esta cita porque su estado actual es: ${cita.estado}. Solo se permiten reseñas en citas completadas.` 
            });
        }

        if (cita.review_done === true) {
            return res.status(400).json({ message: 'Ya has dejado una reseña para esta cita anteriormente.' });
        }

        cita.review_stars = review_stars;
        cita.review_texto = review_texto;
        cita.review_done = true;

        await cita.save();

        res.status(200).json({ 
            message: '¡Gracias por tu reseña! Se ha guardado exitosamente.', 
            citaActualizada: cita 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al procesar la reseña', error: error.message });
    }
};

// 8. Obtener Reseñas de un Negocio (Para la página pública)
exports.obtenerResenasPorNegocio = async (req, res) => {
    try {
        const { id_negocio } = req.params;

        const resenas = await Cita.find({ 
            id_negocio: id_negocio, 
            review_done: true 
        })
        .select('review_stars review_texto id_cliente updatedAt') 
        .populate('id_cliente', 'nombre apellido'); 

        res.status(200).json(resenas);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar los testimonios', error: error.message });
    }
};