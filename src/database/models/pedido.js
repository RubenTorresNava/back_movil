import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
    pedidos: [{
        type: String,
        required: true,
    }],
    numeroMesa: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: 1, // 1: recibido, 2: en preparación, 3: listo, 4: cancelado
        min: 1,
        max: 4,
    },
    total: {
        type: Number,
        required: true,
        min: 0,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;
