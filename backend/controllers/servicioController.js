const Cita = require('../models/Cita');      
const Usuario = require('../models/Usuario');
const Servicio = require('../models/Servicio');

// 1. Agregar servicio a un negocio
exports.crearServicio = async (req, res) => {
    try {
        // Recibimos los datos, incluyendo el rol del usuario que hace la petición
        const { nombre, precio, duracion, descripcion, imagen, id_negocio, rol_usuario } = req.body;

        // VALIDACIÓN 1: ¿Es administrador?
        if (rol_usuario !== 'admin' && rol_usuario !== 'superadmin') {
            return res.status(403).json({ message: 'Acceso denegado. Solo el dueño del negocio puede crear servicios.' });
        }

        if (!nombre || !precio || !duracion || !id_negocio) {
            return res.status(400).json({ message: 'Por favor, completa los campos obligatorios (Nombre, Precio y Duración).' });
        }

        // VALIDACIÓN 2: Precio y Duración estrictamente números
        const precioNum = Number(precio);
        const duracionNum = Number(duracion);
        
        if (isNaN(precioNum) || isNaN(duracionNum)) {
            return res.status(400).json({ message: 'El precio y la duración deben ser valores numéricos.' });
        }

        // VALIDACIÓN 3: La imagen solo puede ser JPG o PNG (leyendo el encabezado Base64)
        if (imagen) {
            if (!imagen.startsWith('data:image/jpeg') && !imagen.startsWith('data:image/png') && !imagen.startsWith('data:image/jpg')) {
                return res.status(400).json({ message: 'Archivo de imagen no válido. Solo se admiten formatos .JPG y .PNG.' });
            }
        }

        const nuevoServicio = new Servicio({
            nombre,
            precio: precioNum,
            duracion: duracionNum,
            descripcion,
            imagen,
            id_negocio
        });

        await nuevoServicio.save();
        res.status(201).json({ message: 'Servicio creado exitosamente', servicio: nuevoServicio });
    } catch (error) {
        res.status(500).json({ message: 'Error interno al crear el servicio.', error: error.message });
    }
};

// 2. Eliminar servicio
exports.eliminarServicio = async (req, res) => {
    try {
        const idServicio = req.params.id;

        // VALIDACIÓN 1: Verificar si hay citas PENDIENTES o PROGRAMADAS con este servicio
        const citasActivas = await Cita.find({
            id_servicio: idServicio,
            estado: { $in: ['pendiente', 'programada'] }
        });

        if (citasActivas.length > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar: Tienes citas pendientes o programadas para este servicio.' 
            });
        }

        // VALIDACIÓN 2: Verificar si hay empleados que tengan asignado este servicio
        const empleadosAsignados = await Usuario.find({
            roles: 'empleado',
            servicio_empl: idServicio
        });

        if (empleadosAsignados.length > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar: Hay empleados que tienen asignado este servicio. Por favor, edita los perfiles de tus empleados y desasigna este servicio primero.' 
            });
        }

        // Si pasa las validaciones, procedemos a eliminar
        await Servicio.findByIdAndDelete(idServicio);
        res.status(200).json({ message: 'Servicio eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error interno al intentar eliminar el servicio', error: error.message });
    }
};

// 3. Obtener Servicios de un negocio
exports.obtenerServiciosPorNegocio = async (req, res) => {
    try {
        const { id_negocio } = req.params;
        const servicios = await Servicio.find({ id_negocio: id_negocio });
        res.status(200).json(servicios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los servicios', error: error.message });
    }
};