import { Router } from "express";
import zonaRoutes from "./zona.routes";
import dispositivoRoutes from "./dispositivo.routes";
import dispositivoZktecoRoutes from "./dispositivo-zkteco.routes";
import credencialBiometricaRoutes from "./credencialBiometrica.routes"; 
import dispositivoZKRoutes from "./dispositivo-zkteco.routes";
const router = Router();

// 📦 Registrar módulos de rutas
router.use("/zonas", zonaRoutes);
router.use("/dispositivos", dispositivoRoutes);
router.use("/dispositivos-zkteco", dispositivoZktecoRoutes);
router.use("/credenciales", credencialBiometricaRoutes); // ✅ Aquí lo registras
router.use("/dispositivos-zk", dispositivoZKRoutes); // Ruta base
export default router;
