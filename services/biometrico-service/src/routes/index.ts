import { Router } from "express";

// 🧭 Importación de rutas organizadas por módulo
import zonaRoutes from "./zona.routes";
import dispositivoRoutes from "./dispositivo.routes";
import dispositivoZktecoRoutes from "./dispositivo-zkteco.routes";
import credencialBiometricaRoutes from "./credencialBiometrica.routes";
import empleadoRoutes from "./empleado.routes";
import departamentoRoutes from "./departamento.routes";
import fuenteFinanciamientoRoutes from "./fuenteFinanciamiento.routes";
import cargoRoutes from "./cargo.routes";

const router = Router();

// 📦 Módulo: Zonas
router.use("/zonas", zonaRoutes);

// 📦 Módulo: Dispositivos (general)
router.use("/dispositivos", dispositivoRoutes);

// 📦 Módulo: Dispositivos ZKTeco (importación, escaneo, etc.)
router.use("/dispositivos-zkteco", dispositivoZktecoRoutes);

// 📦 Módulo: Credenciales biométricas
router.use("/credenciales", credencialBiometricaRoutes);

// 📦 Módulo: Empleados
router.use("/empleados", empleadoRoutes);

// 📦 Módulo: Departamentos
router.use("/departamentos", departamentoRoutes);

// 📦 Módulo: Fuentes de Financiamiento
router.use("/fuentes", fuenteFinanciamientoRoutes);

// 📦 Módulo: Cargos
router.use("/cargos", cargoRoutes);

export default router;
