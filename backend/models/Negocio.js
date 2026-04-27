const mongoose = require('mongoose');

const negocioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: { 
        type: String, 
        required: true, 
        enum: ['Barbería', 'Estética', 'Salón de belleza', 'Salón de uñas'] 
    },
    eslogan: { type: String },
    descripcion: { type: String },
    celular: { type: String, required: true },
    ubicacion: { type: String, required: true }, 
    instagram: { type: String },
    facebook: { type: String },
    banner: { type: String }, 
    
    primaryColor: { type: String, default: '#7F055F' },
    secondaryColor: { type: String, default: '#FFE8D4' },
    
    anticipo: { type: Number, default: 0 },
    
    horario_dia: { type: String },
    hora_apertura: { type: String },
    hora_cierre: { type: String },

    id_usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Negocio', negocioSchema);