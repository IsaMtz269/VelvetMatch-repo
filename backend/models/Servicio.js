const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    duracion: { type: Number, required: true }, 
    descripcion: { type: String },
    imagen: { type: String }, 
    
    id_negocio: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Negocio', 
        required: true 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Servicio', servicioSchema);