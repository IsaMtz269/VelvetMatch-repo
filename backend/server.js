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

// Marcar cita como completado empleado


// CONSULTAS DE NEGOCIOS (GET y PUT)

// 1. Obtener todos los negocios 
app.get('/api/negocios', async (req, res) => {
    try {
        const negocios = await Negocio.find();
        res.status(200).json(negocios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de negocios', error: error.message });
    }
});

// 2. Obtener un negocio específico 
app.get('/api/negocios/:id', async (req, res) => {
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
});


// 3. Actualizar un negocio 
//verificar si esta correcto y una validacion de que el admin sea el que lo este cambiando
app.put('/api/negocios/:id', async (req, res) => {
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
});


// CONSULTAS POR NEGOCIO / CATALOGOS (GET)

// 1. Obtener Servicios de un negocio
app.get('/api/servicios/negocio/:id_negocio', async (req, res) => {
    try {
        const { id_negocio } = req.params;
        const servicios = await Servicio.find({ id_negocio: id_negocio });
        res.status(200).json(servicios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los servicios', error: error.message });
    }
});

// 2. Obtener Empleados de un negocio 
app.get('/api/empleados/negocio/:id_negocio', async (req, res) => {
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
});

// 3. Obtener Posts de un negocio
app.get('/api/posts/negocio/:id_negocio', async (req, res) => {
    try {
        const { id_negocio } = req.params;
        
        const posts = await Post.find({ id_negocio: id_negocio }).sort({ createdAt: -1 });
        
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los posts', error: error.message });
    }
});

// 4. Obtener Fechas Prohibidas de un negocio
app.get('/api/fechas-prohibidas/negocio/:id_negocio', async (req, res) => {
    try {
        const { id_negocio } = req.params;
        const fechas = await FechaProhibida.find({ id_negocio: id_negocio });
        
        res.status(200).json(fechas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las fechas prohibidas', error: error.message });
    }
});

// 5. Obtener Reseñas de un Negocio (Para la página pública)
app.get('/api/resenas/negocio/:id_negocio', async (req, res) => {
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
});



// CONSULTAS DE CITAS (GET y PATCH)


// 1. Obtener citas de un Negocio (Dashboard del Admin)
app.get('/api/citas/negocio/:id_negocio', async (req, res) => {
    try {
        const citas = await Cita.find({ id_negocio: req.params.id_negocio })
            .populate('id_cliente', 'nombre apellido email')
            .populate('id_servicio', 'nombre precio duracion')
            .populate('id_empleado', 'nombre apellido');
            
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener citas del negocio', error: error.message });
    }
});

// 2. Obtener citas de un Empleado (Agenda propia)
app.get('/api/citas/empleado/:id_empleado', async (req, res) => {
    try {
        const citas = await Cita.find({ id_empleado: req.params.id_empleado })
            .populate('id_cliente', 'nombre apellido')
            .populate('id_servicio', 'nombre duracion');
            
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener citas del empleado', error: error.message });
    }
});

// 3. Obtener citas de un Cliente (Historial de reservaciones)
app.get('/api/citas/cliente/:id_cliente', async (req, res) => {
    try {
        const citas = await Cita.find({ id_cliente: req.params.id_cliente })
            .populate('id_negocio', 'nombre ubicacion celular')
            .populate('id_servicio', 'nombre precio')
            .populate('id_empleado', 'nombre apellido');
            
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener historial del cliente', error: error.message });
    }
});

// 4. APROBAR una cita administrador (Pasa de 'pendiente' a 'programada' y se le asigna empleado)
app.patch('/api/citas/aprobar/:id_cita', async (req, res) => {
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
});

// 5. CANCELAR / RECHAZAR una cita (Con regla estricta de 6 horas)
app.patch('/api/citas/cancelar/:id_cita', async (req, res) => {
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
});

// CONSULTAS DE ANALYTICS (GET)

// 1. Analytics del Negocio (Dashboard Admin)
app.get('/api/analytics/negocio/:id_negocio', async (req, res) => {
    try {
        const { id_negocio } = req.params;

        const citasCompletadas = await Cita.find({ 
            id_negocio: id_negocio, 
            estado: 'completada' 
        });

        const totalCitas = citasCompletadas.length;
        
        const ingresosTotales = citasCompletadas.reduce((acc, cita) => acc + (cita.precio_final || 0), 0);

        res.status(200).json({
            id_negocio,
            totalCitas,
            ingresosTotales,
            moneda: 'MXN'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar analytics del negocio', error: error.message });
    }
});

// 2. Analytics Global (Panel Super Administrador)
app.get('/api/analytics/global', async (req, res) => {
    try {
        const totalEmpresas = await Negocio.countDocuments();
        const totalUsuarios = await Usuario.countDocuments();
        const totalOperaciones = await Cita.countDocuments();

        res.status(200).json({
            plataforma: 'Velvet Match',
            totalEmpresas,
            totalUsuarios,
            totalOperaciones,
            mensaje: 'Estadísticas globales de la plataforma'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar analytics globales', error: error.message });
    }
});



app.get('/api/', (req, res) => {
    res.json({ message: 'API funcionando' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});