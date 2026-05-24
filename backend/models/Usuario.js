const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email no válido']
    },
    password: { 
        type: String, 
        required: true,
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'], 
        select: false 
    },
    fechNacimiento: { type: Date, required: true },
    
    
    es_activo: { type: Boolean, default: true },
    roles: { 
        type: String, 
        enum: ['cliente', 'admin', 'empleado', 'superadmin'],
        default: 'cliente' 
    },
    is_empleado: { type: Boolean, default: false },
    
    
    horario_dia: { type: String },
    horario_inicio: { type: String },
    horario_final: { type: String },
    
    
    trabaja_en: { type: mongoose.Schema.Types.ObjectId, ref: 'Negocio' },
    servicio_empl: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Servicio' }] 
}, {
    timestamps: true 
});


userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

module.exports = mongoose.model('Usuario', userSchema);