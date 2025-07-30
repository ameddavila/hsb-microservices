import { Router } from "express";
import { registrarAuditoria } from "@/controllers/auditoria.controller";

const router = Router();

router.post("/registrar", registrarAuditoria);

export default router;
