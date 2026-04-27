const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/velvet_match_db';
const JWT_SECRET = process.env.JWT_SECRET;


mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

const Usuario = require('./models/Usuario');
const Negocio = require('./models/Negocio');
const Servicio = require('./models/Servicio');
const Post = require('./models/Post');
const Cita = require('./models/Cita');
const FechaProhibida = require('./models/FechaProhibida');

//Registrar un cliente 
app.post('/api/register', async (req, res) => {
    
    const { nombre, apellido, email, password, fechNacimiento } = req.body;
    
   
    if(!nombre || !apellido || !email || !password || !fechNacimiento) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await mongoose.model('Usuario').findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
    }

   
    const newuser = new Usuario({ nombre, apellido, email, password, fechNacimiento });

    await newuser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

//Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const user = await mongoose.model('Usuario').findOne({ email }).select('+password');

    if(!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
        mensaje: 'Login exitoso',
        Usuario: { 
            id: user._id, 
            nombre: user.nombre, 
            apellido: user.apellido, 
            email: user.email 
        }, 
        token 
    });
});

//Agregar un negocio
app.post('/api/negocios', async (req, res) => {
    const { 
        nombre, tipo, eslogan, descripcion, celular, ubicacion, 
        instagram, facebook, banner, primaryColor, secondaryColor, 
        anticipo, horario_dia, hora_apertura, hora_cierre, id_usuario 
    } = req.body;

    if (!nombre || !tipo || !celular || !ubicacion || !id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para crear el negocio' });
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

        adminExiste.trabaja_en = nuevoNegocio._id;
        await adminExiste.save();

        res.status(201).json({ message: 'Negocio creado exitosamente', negocio: nuevoNegocio });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el negocio', error: error.message });
    }
});

//Agregar servicio a un negocio
app.post('/api/servicios', async (req, res) => {
    try {
        const nuevoServicio = new Servicio(req.body);
        await nuevoServicio.save();
        res.status(201).json({ message: 'Servicio creado', servicio: nuevoServicio });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear servicio', error: error.message });
    }
});

// Eliminar servicio
app.delete('/api/servicios/:id', async (req, res) => {
    try {
        await Servicio.findByIdAndDelete(req.params.id);
        res.json({ message: 'Servicio eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar', error: error.message });
    }
});

// Agregar post a un negocio
app.post('/api/posts', async (req, res) => {
    try {
        const nuevoPost = new Post(req.body);
        await nuevoPost.save();
        res.status(201).json({ message: 'Post creado', post: nuevoPost });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear post', error: error.message });
    }
});

// Eliminar post
app.delete('/api/posts/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar post', error: error.message });
    }
});

// Crear empleado
app.post('/api/empleados', async (req, res) => {
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
});

// Bloquear una fecha (Día Festivo, Vacaciones, etc.)
app.post('/api/fechas-prohibidas', async (req, res) => {
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
});

// Agendar una nueva cita
app.post('/api/citas', async (req, res) => {
    try {
        const { 
            id_cliente, id_negocio, id_servicio, 
            fecha, hora, precio_final, anticipo_pagado 
        } = req.body;

        if (!id_cliente || !id_negocio || !id_servicio || !fecha || !hora) {
            return res.status(400).json({ message: 'Faltan campos obligatorios para agendar la cita' });
        }

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
            id_cliente,
            id_negocio,
            id_servicio,
            fecha,
            hora,
            precio_final,
            anticipo_pagado
        });

        await nuevaCita.save();

        res.status(201).json({ 
            message: 'Tu cita ha sido enviada y está en revisión', 
            cita: nuevaCita 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al agendar la cita', error: error.message });
    }
});

// Agregar una reseña a una cita completada
app.post('/api/citas/:id_cita/resena', async (req, res) => {
    try {
        const { id_cita } = req.params; // Sacamos el ID de la cita de la URL
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
});


app.get('/api/', (req, res) => {
    res.json({ message: 'API funcionando' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});