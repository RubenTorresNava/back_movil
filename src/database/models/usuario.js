import mongoose from 'mongoose';

const usuario = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['cliente', 'cocinero', 'mesero', 'administrador'],
        default: 'cliente',
    }
});

const Usuario = mongoose.model('Usuario', usuario);

export default Usuario;
