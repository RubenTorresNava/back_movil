import { Server } from 'socket.io';

let io;

// Configurar Socket.IO
export const configureSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // En producción, especifica dominios específicos
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    // Eventos de conexión
    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        // Unir cliente a una sala específica (por ejemplo, por mesa)
        socket.on('join-mesa', (mesaId) => {
            socket.join(`mesa-${mesaId}`);
            console.log(`Cliente ${socket.id} se unió a la mesa ${mesaId}`);
            socket.emit('joined-mesa', mesaId);
        });

        // Unir cliente a sala de cocina (para recibir todos los pedidos)
        socket.on('join-cocina', () => {
            socket.join('cocina');
            console.log(`Cliente ${socket.id} se unió a la cocina`);
            socket.emit('joined-cocina', true);
        });

        // Unir cliente a sala de administrador
        socket.on('join-admin', () => {
            socket.join('admin');
            console.log(`Cliente ${socket.id} se unió como administrador`);
            socket.emit('joined-admin', true);
        });

        // Manejar desconexión
        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    return io;
};

// Obtener instancia de Socket.IO
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO no ha sido inicializado');
    }
    return io;
};

// Funciones para emitir eventos específicos del negocio
export const notifyNewPedido = (pedido) => {
    if (io) {
        // Notificar a la cocina sobre nuevo pedido
        io.to('cocina').emit('nuevo-pedido', pedido);
        
        // Notificar a administradores
        io.to('admin').emit('nuevo-pedido', pedido);
        
        // Notificar a la mesa específica
        if (pedido.mesa) {
            io.to(`mesa-${pedido.mesa}`).emit('pedido-confirmado', pedido);
        }
    }
};

export const notifyPedidoStatusChange = (pedido) => {
    if (io) {
        // Notificar a la mesa específica
        if (pedido.mesa) {
            io.to(`mesa-${pedido.mesa}`).emit('pedido-actualizado', pedido);
        }
        
        // Notificar a la cocina
        io.to('cocina').emit('pedido-actualizado', pedido);
        
        // Notificar a administradores
        io.to('admin').emit('pedido-actualizado', pedido);
    }
};

export const notifyPedidoReady = (pedido) => {
    if (io) {
        // Notificar a la mesa que su pedido está listo
        if (pedido.mesa) {
            io.to(`mesa-${pedido.mesa}`).emit('pedido-listo', pedido);
        }
        
        // Notificar a administradores
        io.to('admin').emit('pedido-listo', pedido);
    }
};
