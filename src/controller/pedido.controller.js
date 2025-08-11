import Pedido from '../database/models/pedido.js';
import { notifyNewPedido, notifyPedidoStatusChange, notifyPedidoReady } from '../service/socketService.js';

export const createPedido = async (req, res) => {
    const { numeroMesa, pedidos, total } = req.body;

    try {
        // Validación básica
        if (!numeroMesa || !pedidos?.length || !total) {
            return res.status(400).json({ error: 'Número de mesa, pedidos y total son requeridos' });
        }

        // Crear pedido
        const newPedido = new Pedido({
            numeroMesa,
            pedidos,
            total,
            status: 1 // recibido por defecto
        });

        await newPedido.save();

        // Preparar respuesta
        const response = {
            ...newPedido.toObject(),
            pedidos: newPedido.pedidos
        };

        // Notificar (WebSocket/Socket.io)
        notifyNewPedido(response);

        res.status(201).json({
            success: true,
            pedido: response
        });

    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error al crear pedido'
        });
    }
};

// Función para traer todos los pedidos
export const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find()
            .sort({ fechaCreacion: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: pedidos.length,
            pedidos: pedidos
        });

    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener pedidos',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

// Función para actualizar el status de un pedido
export const updatePedido = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedPedido = await Pedido.findByIdAndUpdate(id, { status }, { new: true });
            
        if (!updatedPedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Notificar cambio de status a través de WebSocket
        notifyPedidoStatusChange(updatedPedido);
        
        // Si el status es "listo" (3), enviar notificación especial
        if (status === 3) {
            notifyPedidoReady(updatedPedido);
        }
        
        res.status(200).json({ message: 'Status del pedido actualizado exitosamente', pedido: updatedPedido });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
}

// Función para obtener pedidos por número de mesa
export const getPedidosByUser = async (req, res) => {
    const { numeroMesa } = req.query;
    
    if (!numeroMesa) {
        return res.status(400).json({ error: 'numeroMesa es requerido' });
    }
    
    try {
        const pedidos = await Pedido.find({ numeroMesa }) 
            .sort({ fechaCreacion: -1 });

        res.status(200).json({
            success: true,
            pedidos: pedidos
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener pedidos',
            details: error.message
        });
    }
};