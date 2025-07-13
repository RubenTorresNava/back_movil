import * as pedidoController from '../controller/pedido.controller.js';
import { Router } from 'express';
import checkRole from '../middleware/checkrole.js';

const router = Router();

router.get ('/pedidos-cocina', checkRole(['cocinero']), pedidoController.getPedidos);
router.put('/pedidos-cocina/:id', checkRole(['cocinero']), pedidoController.updatePedido);

export default router;