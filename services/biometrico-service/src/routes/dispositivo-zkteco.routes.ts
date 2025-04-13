import { Router } from "express";
import {
  testConexionDispositivo,
  getUsuariosDispositivo,
  getMarcacionesDispositivo,
} from "@/controllers/dispositivo-zkteco.controller";

import { authenticateToken } from "@/middlewares/authenticateToken";
import { checkPermission } from "@/middlewares/checkPermission";
import { getUsuariosConBiometria } from "@/controllers/dispositivo-zkteco.controller";

const router = Router();

router.get("/:id/test-connection", authenticateToken, checkPermission(["Administrador"]), testConexionDispositivo);
router.get("/:id/users", authenticateToken, checkPermission(["Administrador"]), getUsuariosDispositivo);
router.get("/:id/logs", authenticateToken, checkPermission(["Administrador"]), getMarcacionesDispositivo);

router.get(
    "/:id/users-bio",
    authenticateToken,
    checkPermission(["Administrador"]),
    getUsuariosConBiometria
  );

export default router;
