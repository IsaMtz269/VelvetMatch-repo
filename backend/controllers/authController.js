// backend/controllers/authController.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Función para calcular si es mayor de 16 años en el backend
const esMayorDe16 = (fecha) => {
    if (!fecha) return false;
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const mes = hoy.getMonth() - cumpleanos.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    return edad >= 16;
};

// Exportamos la función de registro
exports.registrarUsuario = async (req, res) => {
   const { nombre, apellido, email, password, fechNacimiento, roles } = req.body;
    
    if(!nombre || !apellido || !email || !password || !fechNacimiento) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // VALIDACIÓN: Nombre y Apellido solo letras
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexLetras.test(nombre) || !regexLetras.test(apellido)) {
        return res.status(400).json({ message: 'El nombre y apellido solo deben contener letras.' });
    }

    // VALIDACIÓN: Mayor de 16 años
    if (!esMayorDe16(fechNacimiento)) {
        return res.status(400).json({ message: 'Debes ser mayor de 16 años para registrarte.' });
    }

    try {
        const existingUser = await Usuario.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const newuser = new Usuario({ nombre, apellido, email, password, fechNacimiento, roles: roles || 'cliente' });
        await newuser.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente', usuario: newuser });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar', error: error.message });
    }
};

// Exportamos la función de login
exports.loginUsuario = async (req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const user = await Usuario.findOne({ email }).select('+password');
        if(!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            mensaje: 'Login exitoso',
            Usuario: { id: user._id, nombre: user.nombre, apellido: user.apellido, email: user.email, roles: user.roles,id_negocio: user.trabaja_en }, 
            token 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el login', error: error.message });
    }
};