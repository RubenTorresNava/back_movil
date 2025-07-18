import { Router } from 'express';
import * as pedidoController from '../controller/pedido.controller.js';
import {authenticate} from '../middleware/auth.middleware.js';

const router = Router();

router.post('/pedidos', authenticate, pedidoController.createPedido);
router.get('/pedidos', authenticate, pedidoController.getPedidos);
router.put('/pedidos/:id', authenticate, pedidoController.updatePedido);

export default router;
