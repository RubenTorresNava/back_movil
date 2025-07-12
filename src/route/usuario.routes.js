import { Router } from "express";
import * as usuarioController from "../controller/usuario.controller.js";

const router = Router();

router.post("/iniciar-sesion", usuarioController.iniciarSesion);
router.post("/registrar", usuarioController.registrarUsuario);
router.post("/cerrar-sesion", usuarioController.cerrarSesion);

export default router;
