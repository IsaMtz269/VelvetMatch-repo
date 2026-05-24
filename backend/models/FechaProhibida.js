const mongoose = require('mongoose');

const fechaProhibidaSchema = new mongoose.Schema({
    id_negocio: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Negocio', 
        required: true 
    },
    fecha_f: { type: Date, required: true }, 
    razon_f: { type: String, required: true } 
}, {
    timestamps: true 
});

module.exports = mongoose.model('FechaProhibida', fechaProhibidaSchema);