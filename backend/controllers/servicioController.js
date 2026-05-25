// backend/controllers/servicioController.js
// backend/controllers/servicioController.js
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
        await Servicio.findByIdAndDelete(req.params.id);
        res.json({ message: 'Servicio eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar', error: error.message });
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