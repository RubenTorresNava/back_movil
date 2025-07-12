import { getIO } from '../service/socketService.js';

// Funciones para enviar notificaciones manuales desde la API REST
export const sendNotificationToMesa = async (req, res) => {
    try {
        const { mesaId, message, type } = req.body;
        const io = getIO();
        
        io.to(`mesa-${mesaId}`).emit('notification', {
            type,
            message,
            timestamp: new Date()
        });
        
        res.status(200).json({ message: 'Notificación enviada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar notificación' });
    }
};

export const sendNotificationToCocina = async (req, res) => {
    try {
        const { message, type } = req.body;
        const io = getIO();
        
        io.to('cocina').emit('notification', {
            type,
            message,
            timestamp: new Date()
        });
        
        res.status(200).json({ message: 'Notificación enviada a cocina exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar notificación a cocina' });
    }
};

export const broadcastNotification = async (req, res) => {
    try {
        const { message, type, excludeRooms } = req.body;
        const io = getIO();
        
        // Enviar a todos los clientes conectados excepto a las salas excluidas
        io.emit('notification', {
            type,
            message,
            timestamp: new Date()
        });
        
        res.status(200).json({ message: 'Notificación broadcast enviada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar notificación broadcast' });
    }
};

export const getConnectedClients = async (req, res) => {
    try {
        const io = getIO();
        const sockets = await io.fetchSockets();
        
        res.status(200).json({ 
            totalConnected: sockets.length,
            clients: sockets.map(socket => ({
                id: socket.id,
                rooms: Array.from(socket.rooms)
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener clientes conectados' });
    }
};
