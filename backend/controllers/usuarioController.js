// backend/controllers/usuarioController.js
const Usuario = require('../models/Usuario');
const Negocio = require('../models/Negocio');
const Servicio = require('../models/Servicio');
const bcrypt = require('bcryptjs');

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

exports.crearEmpleado = async (req, res) => {
    try {
        const { 
            nombre, apellido, email, password, fechNacimiento, 
            id_negocio, servicio_empl, horario_dia, rol_usuario 
        } = req.body;

        if (rol_usuario !== 'admin' && rol_usuario !== 'superadmin') {
            return res.status(403).json({ message: 'Acceso denegado. Solo el administrador puede agregar empleados.' });
        }

        if (!nombre || !apellido || !email || !password || !fechNacimiento || !id_negocio) {
            return res.status(400).json({ message: 'Faltan campos obligatorios para registrar al empleado.' });
        }

        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!regexLetras.test(nombre) || !regexLetras.test(apellido)) {
            return res.status(400).json({ message: 'El nombre y apellido solo deben contener letras.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
        }

        if (!esMayorDe16(fechNacimiento)) {
            return res.status(400).json({ message: 'El empleado debe ser mayor de 16 años para ser registrado.' });
        }

        if (!servicio_empl || servicio_empl.length === 0) {
            return res.status(400).json({ message: 'El empleado debe tener al menos una especialidad (servicio) asignada.' });
        }

        const emailExist = await Usuario.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: 'Este correo electrónico ya está registrado en otra cuenta.' });
        }

        const nuevoEmpleado = new Usuario({
            nombre, apellido, email, password, fechNacimiento, 
            trabaja_en: id_negocio, roles: 'empleado', is_empleado: true,
            servicio_empl, horario_dia
        });

        await nuevoEmpleado.save();
        res.status(201).json({ message: 'Empleado creado exitosamente', empleado: nuevoEmpleado });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear empleado', error: error.message });
    }
};

// Obtener Empleados de un negocio 
exports.obtenerEmpleadosPorNegocio = async (req, res) => {
    try {
        const { id_negocio } = req.params;
        const empleados = await Usuario.find({ 
            trabaja_en: id_negocio,
            roles: 'empleado' 
        });
        res.status(200).json(empleados);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los empleados', error: error.message });
    }
};

// Actualizar perfil de usuario (usada por el cliente para actualizar su perfil)
exports.actualizarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, fechNacimiento, password } = req.body;
    const idUsuario = req.params.id;

    if (!nombre || !apellido || !email || !fechNacimiento) {
        return res.status(400).json({ message: 'Nombre, Apellido, Email y Fecha de Nacimiento son campos obligatorios.' });
    }

    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexLetras.test(nombre) || !regexLetras.test(apellido)) {
        return res.status(400).json({ message: 'El nombre y el apellido solo deben contener letras.' });
    }

    if (!esMayorDe16(fechNacimiento)) {
        return res.status(400).json({ message: 'Debes ser mayor de 16 años para actualizar tu perfil.' });
    }

    const emailExiste = await Usuario.findOne({ email, _id: { $ne: idUsuario } });
    if (emailExiste) {
        return res.status(400).json({ message: 'El correo electrónico ingresado ya pertenece a otro usuario.' });
    }

    const datosActualizar = { nombre, apellido, email, fechNacimiento };

    if (password && password.trim() !== "") {
        if (password.length < 8) {
            return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 8 caracteres.' });
        }
        const salt = await bcrypt.genSalt(10);
        datosActualizar.password = await bcrypt.hash(password, salt);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      idUsuario,
      datosActualizar,
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ 
      message: '¡Tu perfil se ha actualizado correctamente!', 
      usuario: usuarioActualizado 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno al actualizar perfil', error: error.message });
  }
};

// Obtener todos los usuarios (para superadmin)
    exports.obtenerTodosUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find()
        .populate('trabaja_en', 'nombre tipo');
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
    };