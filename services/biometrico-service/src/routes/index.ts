import { Router } from "express";

// 🧭 Importación de rutas organizadas por módulo
import cargoRoutes from "./cargo.routes";
import credencialBiometricaRoutes from "./credencialBiometrica.routes";
import departamentoRoutes from "./departamento.routes";
import dispositivoRoutes from "./dispositivo.routes";
import dispositivoZktecoRoutes from "./dispositivo-zkteco.routes";
import empleadoRoutes from "./empleado.routes";
import empleadoZKRoutes from "./empleadoZK.routes";
import fuenteFinanciamientoRoutes from "./fuenteFinanciamiento.routes";
import zonaRoutes from "./zona.routes";
import auditoriaRouter from "./auditoria.routes";
import dispositivoCargaRouter from "./dispositivoCarga.routes";
import empleadadoCargaRouter from "./empleadoCarga.routes";


const router = Router();

// 📦 Módulo: Cargos
router.use("/cargos", cargoRoutes);

// 📦 Módulo: Credenciales biométricas
router.use("/credenciales", credencialBiometricaRoutes);

// 📦 Módulo: Departamentos
router.use("/departamentos", departamentoRoutes);

// 📦 Módulo: Dispositivos (general)
router.use("/dispositivos", dispositivoRoutes);

// 📦 Módulo: Dispositivos ZKTeco (importación, escaneo, etc.)
router.use("/dispositivos-zkteco", dispositivoZktecoRoutes);

// 📦 Módulo: Empleados
router.use("/empleados", empleadoRoutes);

// 📦 Módulo: Empleados ZK (operaciones especiales)
router.use("/empleados-zk", empleadoZKRoutes);

// 📦 Módulo: Fuentes de Financiamiento
router.use("/fuentes", fuenteFinanciamientoRoutes);

// 📦 Módulo: Zonas
router.use("/zonas", zonaRoutes);

// 🚀 Aquí agregar nuevas rutas cuando se creen módulos adicionales

router.use("/auditoria", auditoriaRouter);
router.use("/dispositivos", dispositivoCargaRouter);
router.use("/carga", empleadadoCargaRouter)

export default router;
