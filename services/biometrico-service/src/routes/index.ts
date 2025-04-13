import { Router } from "express";
import zonaRoutes from "./zona.routes";
import dispositivoRoutes from "./dispositivo.routes";
import dispositivoZktecoRoutes from "./dispositivo-zkteco.routes";

// 🧩 Enrutador principal
const router = Router();

// 📦 Registrar módulos de rutas
router.use("/zonas", zonaRoutes);

router.use("/dispositivos", dispositivoRoutes);

router.use("/dispositivos-zkteco", dispositivoZktecoRoutes);

// Aquí puedes agregar más rutas:
// import empleadoRoutes from "./empleado.routes";
// router.use("/empleados", empleadoRoutes);

export default router;
