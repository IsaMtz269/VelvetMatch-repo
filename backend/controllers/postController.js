// backend/controllers/postController.js
const Post = require('../models/Post');

// 1. Agregar post a un negocio
exports.crearPost = async (req, res) => {
    try {
        const nuevoPost = new Post(req.body);
        await nuevoPost.save();
        res.status(201).json({ message: 'Post creado', post: nuevoPost });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear post', error: error.message });
    }
};

// 2. Eliminar post
exports.eliminarPost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar post', error: error.message });
    }
};

// 3. Obtener Posts de un negocio
exports.obtenerPostsPorNegocio = async (req, res) => {
    try {
        const { id_negocio } = req.params;
        
        // .sort({ createdAt: -1 }) ordena los posts para que los más recientes salgan primero
        const posts = await Post.find({ id_negocio: id_negocio }).sort({ createdAt: -1 });
        
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los posts', error: error.message });
    }
};