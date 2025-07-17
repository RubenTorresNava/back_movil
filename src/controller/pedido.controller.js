import Pedido from '../database/models/pedido.js';
import Producto from '../database/models/producto.js';
import Mesa from '../database/models/mesa.js';
import { notifyNewPedido, notifyPedidoStatusChange, notifyPedidoReady } from '../service/socketService.js';

export const createPedido = async (req, res) => {
    const { cliente, mesa, productos, estado } = req.body; 

    try {
        const productosConPrecio = await Promise.all(
            productos.map(async (item) => {
                const producto = await Producto.findById(item.producto);
                return {
                    producto: item.producto,
                    cantidad: item.cantidad,
                    precioUnitario: producto.precio 
                };
            })
        );

        const total = productosConPrecio.reduce(
            (acc, item) => acc + (item.precioUnitario * item.cantidad),
            0
        );

        const newPedido = new Pedido({
            cliente,
            mesa,
            productos: productosConPrecio,
            estado,
            total
        });

        await newPedido.save();

        const pedidoPoblado = await Pedido.findById(newPedido._id)
            .populate('cliente')
            .populate('mesa')
            .populate('productos.producto');

        notifyNewPedido(pedidoPoblado);

        res.status(201).json({ 
            message: 'Pedido creado exitosamente', 
            pedido: pedidoPoblado 
        });
    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({ 
            error: 'Error al crear el pedido',
            details: error.message 
        });
    }
};

// Función para obtener todos los pedidos
export const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate('mesa').populate('productos.producto');
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
}

// Función para actualizar el estado de un pedido
export const updatePedido = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const updatedPedido = await Pedido.findByIdAndUpdate(id, { estado }, { new: true })
            .populate('cliente')
            .populate('mesa')
            .populate('productos.producto');
            
        if (!updatedPedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Notificar cambio de estado a través de WebSocket
        notifyPedidoStatusChange(updatedPedido);
        
        // Si el estado es "listo", enviar notificación especial
        if (estado === 'listo') {
            notifyPedidoReady(updatedPedido);
        }
        
        res.status(200).json({ message: 'Estado del pedido actualizado exitosamente', pedido: updatedPedido });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
}

