import Pedido from '../database/models/pedido.js';
import { notifyNewPedido, notifyPedidoStatusChange, notifyPedidoReady } from '../service/socketService.js';

// Función para crear un nuevo pedido
export const createPedido = async (req, res) => {
    const { cliente, mesa, productos, estado, total } = req.body;

    try {
        const newPedido = new Pedido({
            cliente,
            mesa,
            productos,
            estado,
            total
        });

        await newPedido.save();
        
        // Poblar los datos para la notificación
        await newPedido.populate('cliente');
        await newPedido.populate('mesa');
        await newPedido.populate('productos.producto');
        
        // Notificar a través de WebSocket
        notifyNewPedido(newPedido);
        
        res.status(201).json({ message: 'Pedido creado exitosamente', pedido: newPedido });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
}

// Función para obtener todos los pedidos
export const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate('cliente').populate('mesa').populate('productos.producto');
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

