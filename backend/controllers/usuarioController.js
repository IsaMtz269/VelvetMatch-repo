// backend/controllers/usuarioController.js
const Usuario = require('../models/Usuario');
const Negocio = require('../models/Negocio');
const Servicio = require('../models/Servicio');


//EMPLEADO

// Función para registrar un empleado (usada por el Administrador)
exports.crearEmpleado = async (req, res) => {
    try {
        const { 
            nombre, apellido, email, password, fechNacimiento, 
            id_negocio, servicio_empl, horario_dia, horario_inicio, horario_final 
        } = req.body;

        if (!nombre || !apellido || !email || !password || !fechNacimiento || !id_negocio) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const negocio = await Negocio.findById(id_negocio);
        if (!negocio) {
            return res.status(404).json({ message: 'Negocio no encontrado' });
        }

        const cantidadServicios = await Servicio.countDocuments({ id_negocio: id_negocio });
        
        if (cantidadServicios === 0) {
            return res.status(400).json({ 
                message: 'No puedes agregar empleados sin antes haber registrado al menos un servicio en tu negocio.' 
            });
        }

        const nuevoEmpleado = new Usuario({
            nombre, 
            apellido, 
            email, 
            password,
            fechNacimiento, 
            trabaja_en: id_negocio,
            roles: 'empleado',
            is_empleado: true,
            servicio_empl,
            horario_dia,
            horario_inicio,
            horario_final
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
    const { nombre, apellido, email, fechNacimiento } = req.body;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, email, fechNacimiento },
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ 
      message: 'Perfil actualizado correctamente', 
      usuario: usuarioActualizado 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
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