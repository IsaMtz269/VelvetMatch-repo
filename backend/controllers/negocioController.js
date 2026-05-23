// backend/controllers/negocioController.js
const Negocio = require('../models/Negocio');
const Usuario = require('../models/Usuario');

// 1. Agregar un negocio
exports.crearNegocio = async (req, res) => {
    // Usamos 'let' para poder modificar 'instagram' antes de guardarlo
    let { 
        nombre, tipo, eslogan, descripcion, celular, ubicacion, 
        instagram, facebook, banner, primaryColor, secondaryColor, 
        anticipo, horario_dia, hora_apertura, hora_cierre, id_usuario 
    } = req.body;

    if (!nombre || !tipo || !celular || !ubicacion || !id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para crear el negocio' });
    }

    // VALIDACIÓN: Celular debe ser de exactamente 10 números
    const regexNumeros = /^\d{10}$/;
    if (!regexNumeros.test(celular)) {
        return res.status(400).json({ message: 'El celular debe contener exactamente 10 números.' });
    }

    // VALIDACIÓN: Ubicación (Ciudad) solo letras
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexLetras.test(ubicacion)) {
        return res.status(400).json({ message: 'La ciudad solo debe contener letras.' });
    }

    // VALIDACIÓN Y LIMPIEZA: Instagram sin espacios y con '@'
    if (instagram) {
        // Quita todos los espacios en blanco
        instagram = instagram.replace(/\s/g, '');
        // Agrega el '@' al inicio si no lo tiene
        if (!instagram.startsWith('@')) {
            instagram = '@' + instagram;
        }
    }

    try {
        const adminExiste = await Usuario.findById(id_usuario);
        if (!adminExiste) {
            return res.status(404).json({ message: 'El usuario administrador no existe' });
        }

        const nuevoNegocio = new Negocio({
            nombre, tipo, eslogan, descripcion, celular, ubicacion, 
            instagram, facebook, banner, primaryColor, secondaryColor, 
            anticipo, horario_dia, hora_apertura, hora_cierre, id_usuario
        });

        await nuevoNegocio.save();

        // Actualizamos al admin para vincularlo con su nuevo negocio
        adminExiste.trabaja_en = nuevoNegocio._id;
        await adminExiste.save();

        res.status(201).json({ message: 'Negocio creado exitosamente', negocio: nuevoNegocio });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el negocio', error: error.message });
    }
};

// 2. Obtener todos los negocios 
exports.obtenerNegocios = async (req, res) => {
    try {
        const negocios = await Negocio.find();
        res.status(200).json(negocios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de negocios', error: error.message });
    }
};

// 3. Obtener un negocio específico 
exports.obtenerNegocioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const negocio = await Negocio.findById(id);

        if (!negocio) {
            return res.status(404).json({ message: 'Negocio no encontrado' });
        }

        res.status(200).json(negocio);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el negocio', error: error.message });
    }
};

// 4. Actualizar un negocio 
//verificar si esta correcto y una validacion de que el admin sea el que lo este cambiando
exports.actualizarNegocio = async (req, res) => {
    try {
        const { id } = req.params;

        const negocioActualizado = await Negocio.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } 
        );

        if (!negocioActualizado) {
            return res.status(404).json({ message: 'Negocio no encontrado para actualizar' });
        }

        res.status(200).json({ 
            message: 'Información del negocio actualizada exitosamente', 
            negocio: negocioActualizado 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el negocio', error: error.message });
    }
};