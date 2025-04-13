import { Router } from "express";
import {
  crearDispositivoController,
  obtenerDispositivosController,
  obtenerDispositivoPorIdController,
  actualizarDispositivoController,
  eliminarDispositivoController,
} from "@/controllers/dispositivo.controller";
import { authenticateToken } from "@/middlewares/authenticateToken";
import { checkPermission } from "@/middlewares/checkPermission";

const router = Router();

router.get("/", authenticateToken, checkPermission(["Administrador"]), obtenerDispositivosController);
router.get("/:id", authenticateToken, checkPermission(["Administrador"]), obtenerDispositivoPorIdController);
router.post("/", authenticateToken, checkPermission(["Administrador"]), crearDispositivoController);
router.put("/:id", authenticateToken, checkPermission(["Administrador"]), actualizarDispositivoController);
router.delete("/:id", authenticateToken, checkPermission(["Administrador"]), eliminarDispositivoController);

export default router;
