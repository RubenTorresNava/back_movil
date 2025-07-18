import * as pedidoController from '../controller/pedido.controller.js';
import { Router } from 'express';
import checkRole from '../middleware/checkrole.middleware.js';

const router = Router();

router.get ('/pedidos', checkRole(['cocinero']), pedidoController.getPedidos);
router.put('/pedidos/:id', checkRole(['cocinero']), pedidoController.updatePedido);

export default router;