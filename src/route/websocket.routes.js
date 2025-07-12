import { Router } from 'express';
import { 
    sendNotificationToMesa, 
    sendNotificationToCocina, 
    broadcastNotification, 
    getConnectedClients 
} from '../controller/websocket.controller.js';

const router = Router();

// Ruta para enviar notificación a una mesa específica
router.post('/notify/mesa', sendNotificationToMesa);

// Ruta para enviar notificación a la cocina
router.post('/notify/cocina', sendNotificationToCocina);

// Ruta para enviar notificación broadcast a todos
router.post('/notify/broadcast', broadcastNotification);

// Ruta para obtener clientes conectados
router.get('/clients', getConnectedClients);

export default router;
