import { Router } from "express";
import {
  testConexionDispositivo,
  getUsuariosDispositivo,
  getMarcacionesDispositivo,
  getUsuariosConBiometria
} from "@/controllers/dispositivo-zkteco.controller";

import { authenticateToken } from "@/middlewares/authenticateToken";
import { checkPermission } from "@/middlewares/checkPermission";

const router = Router();

/**
 * 📡 Rutas para gestión directa de dispositivos ZKTeco.
 * Todas protegidas con autenticación y permisos de Administrador.
 */

// 🔌 Probar conexión con dispositivo
router.get(
  "/:id/test-connection",
  authenticateToken,
  checkPermission(["Administrador"]),
  testConexionDispositivo
);

// 👥 Obtener usuarios del dispositivo
router.get(
  "/:id/users",
  authenticateToken,
  checkPermission(["Administrador"]),
  getUsuariosDispositivo
);

// 🕒 Obtener logs/marcaciones del dispositivo
router.get(
  "/:id/logs",
  authenticateToken,
  checkPermission(["Administrador"]),
  getMarcacionesDispositivo
);

// 📸✋ Obtener usuarios con biometría (rostro o huella)
router.get(
  "/:id/users-bio",
  authenticateToken,
  checkPermission(["Administrador"]),
  getUsuariosConBiometria
);

export default router;
