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

app.get('/api/', (req, res) => {
    res.json({ message: 'API funcionando' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});