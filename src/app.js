import express from 'express';
import morgan from 'morgan';
import corse from 'cors';
import websocketRoutes from './route/websocket.routes.js';
import usuarioRoutes from './route/usuario.routes.js';
import pedidoRoutes from './route/pedido.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(corse());
app.use(express.json());

// Rutas
app.use('/api/websocket', websocketRoutes);

app.get ('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.use('/api/usuario', usuarioRoutes);
app.use('/api/pedido', pedidoRoutes);

export default app;