// backend/controllers/postController.js
const Post = require('../models/Post');

// 1. Agregar post a un negocio
exports.crearPost = async (req, res) => {
    try {
        const { titulo_p, contenido, image_url, id_negocio, rol_usuario } = req.body;

        // VALIDACIÓN 1: Seguridad de Roles (Cadenero del Back-End)
        if (rol_usuario !== 'admin' && rol_usuario !== 'superadmin' && rol_usuario !== 'empleado') {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permisos para publicar novedades.' });
        }

        if (!titulo_p || !contenido || !id_negocio) {
            return res.status(400).json({ message: 'El título y el contenido son obligatorios.' });
        }

        // VALIDACIÓN 2: La imagen solo puede ser JPG o PNG
        if (image_url) {
            if (!image_url.startsWith('data:image/jpeg') && !image_url.startsWith('data:image/png') && !image_url.startsWith('data:image/jpg')) {
                return res.status(400).json({ message: 'Formato de imagen no válido. Solo se admiten JPG y PNG.' });
            }
        }

        const nuevoPost = new Post({
            titulo_p,
            contenido,
            image_url,
            id_negocio
        });

        await nuevoPost.save();
        res.status(201).json({ message: 'Post publicado exitosamente', post: nuevoPost });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear post', error: error.message });
    }
};

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