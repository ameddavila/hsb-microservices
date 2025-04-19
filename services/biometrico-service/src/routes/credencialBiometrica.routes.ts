import { Router } from "express";
import { sincronizarPlantillas } from "@/controllers/credencialBiometrica.controller";

const router = Router();

router.get("/sincronizar/:dispositivoId", sincronizarPlantillas);

export default router;
