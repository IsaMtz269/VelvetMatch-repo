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


const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const negocioRoutes = require('./routes/negocioRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const postRoutes = require('./routes/postRoutes');
const citaRoutes = require('./routes/citaRoutes');
const fechaProhibidaRoutes = require('./routes/fechaProhibidaRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Usar rutas (El /api se pone aquí como base)
app.use('/api', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/negocios', negocioRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/fechas-prohibidas', fechaProhibidaRoutes);
app.use('/api/analytics', analyticsRoutes);

// Marcar cita como completado empleado

app.get('/api/', (req, res) => {
    res.json({ message: 'API funcionando' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});