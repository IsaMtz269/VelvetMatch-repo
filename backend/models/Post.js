const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    id_negocio: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Negocio', 
        required: true 
    },
    titulo_p: { type: String, required: true }, 
    contenido: { type: String, required: true }, 
    image_url: { type: String }, 
    video_url: { type: String }  
}, {
    timestamps: true 
});

module.exports = mongoose.model('Post', postSchema);