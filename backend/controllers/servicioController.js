// backend/controllers/servicioController.js
const Servicio = require('../models/Servicio');

// 1. Agregar servicio a un negocio
exports.crearServicio = async (req, res) => {
    try {
        const nuevoServicio = new Servicio(req.body);
        await nuevoServicio.save();
        res.status(201).json({ message: 'Servicio creado', servicio: nuevoServicio });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear servicio', error: error.message });
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