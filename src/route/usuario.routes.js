import { Router } from "express";
import * as usuarioController from "../controller/usuario.controller.js";

const router = Router();

router.post("/iniciar-sesion", usuarioController.loginUser);
router.post("/registrar", usuarioController.registerUser);
router.post("/cerrar-sesion", usuarioController.logoutUser);

export default router;
