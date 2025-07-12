import app from './app.js';
import { connectDB } from './database/connection.js';
import { createServer } from 'http';
import { configureSocket } from './service/socketService.js';

const startServer = async () => {
    try{
        await connectDB();
        
        // Crear servidor HTTP
        const server = createServer(app);
        
        // Configurar Socket.IO
        const io = configureSocket(server);
        
        // Iniciar servidor
        server.listen(3000, () => {
            console.log(`Server is running on port 3000`);
            console.log('WebSocket server is ready');
        });
    }catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();
