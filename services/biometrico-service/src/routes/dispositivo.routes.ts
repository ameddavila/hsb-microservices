import { Router } from "express";
import {
  crearDispositivoController,
  obtenerDispositivosController,
  obtenerDispositivoPorIdController,
  actualizarDispositivoController,
  eliminarDispositivoController,
  registrarDispositivoController,
  buscarDispositivosEnRed
} from "@/controllers/dispositivo.controller";

import { authenticateToken } from "@/middlewares/authenticateToken";
import { checkPermission } from "@/middlewares/checkPermission";

const router = Router();


router.get("/descubrir", authenticateToken, checkPermission(["Administrador"]), buscarDispositivosEnRed);

// 🟢 Dispositivos ya registrados en la BD
router.get("/", authenticateToken, checkPermission(["Administrador"]), obtenerDispositivosController);
router.get("/:id", authenticateToken, checkPermission(["Administrador"]), obtenerDispositivoPorIdController);
router.post("/", authenticateToken, checkPermission(["Administrador"]), crearDispositivoController);
router.put("/:id", authenticateToken, checkPermission(["Administrador"]), actualizarDispositivoController);
router.delete("/:id", authenticateToken, checkPermission(["Administrador"]), eliminarDispositivoController);

// 🟡 Dispositivos detectados desde la red vía zk-bioagent

router.post("/registrar", authenticateToken, checkPermission(["Administrador"]), registrarDispositivoController);

export default router;
