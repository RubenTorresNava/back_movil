import * as pedidoController from '../controller/pedido.controller.js';
import { Router } from 'express';

const router = Router();

router.get ('/pedidos', pedidoController.getPedidos);
router.put('/pedidos/:id', pedidoController.updatePedido);

export default router;