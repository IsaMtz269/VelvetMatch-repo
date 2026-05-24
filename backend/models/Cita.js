const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
    id_cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    id_negocio: { type: mongoose.Schema.Types.ObjectId, ref: 'Negocio', required: true },
    id_servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio', required: true },
    
    id_empleado: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },

    fecha: { type: String, required: true },
    hora: { type: String, required: true },  

    estado: { 
        type: String, 
        enum: ['pendiente', 'programada', 'completada', 'cancelada', 'rechazada'],
        default: 'pendiente'
    },

    motivo_rechazo: { type: String }, 

    precio_final: { type: Number },
    anticipo_pagado: { type: Number },

    review_done: { type: Boolean, default: false },
    review_stars: { type: Number, min: 1, max: 5 },
    review_texto: { type: String }

}, {
    timestamps: true
});

module.exports = mongoose.model('Cita', citaSchema);