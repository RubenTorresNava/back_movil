import express from 'express';
import morgan from 'morgan';
import corse from 'cors';
import websocketRoutes from './route/websocket.routes.js';

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

export default app;