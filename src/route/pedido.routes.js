import { Router } from 'express';
import * as pedidoController from '../controller/pedido.controller.js';

const router = Router();

router.post('/pedidos', pedidoController.createPedido);
router.get('/pedidos', pedidoController.getPedidos);
router.put('/pedidos/:id', pedidoController.updatePedido);
router.get('/pedidos/usuario', pedidoController.getPedidosByUser);

export default router;
