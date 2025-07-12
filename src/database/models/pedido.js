import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true,
    },
    mesa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mesa',
        required: true,
    },
    productos: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto',
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1,
        },
    }],
    estado: {
        type: String,
        enum: ['recibido', 'en preparación', 'listo', 'cancelado'],
        default: 'recibido',
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
