import mongoose from 'mongoose';

const mesaSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: true,
    },
    capacidad: {
        type: Number,
        required: true,
    },
    estado: {
        type: String,
        enum: ['disponible', 'ocupada', 'reservada'],
        default: 'disponible',
    },
})

const Mesa = mongoose.model('Mesa', mesaSchema);

export default Mesa;
