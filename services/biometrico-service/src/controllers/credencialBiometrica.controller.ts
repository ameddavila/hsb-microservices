import { Request, Response } from "express";
import { 
    sincronizarPlantillasDesdeZKAgent, 
    sincronizarCredencialesFaltantes, 
    obtenerEstadoCredenciales } from "../services/credencialBiometrica.service";
import { z } from "zod";
import { logger } from "../utils/logger";

// 🎯 Schema Zod global para validar tipos de biometría
const tipoBiometriaSchema = z.enum(["rostro", "huella", "password", "palma", "todo"]);

// =======================================================
// 🔹 Helper para validar tipo de biometría
// =======================================================
const validarTipoBiometria = (tipo: any, res: Response) => {
    const tipoValidado = tipoBiometriaSchema.safeParse(tipo);
    if (!tipoValidado.success) {
        res.status(400).json({
            success: false,
            mensaje: `Tipo inválido. Debe ser uno de: ${tipoBiometriaSchema.options.join(", ")}.`
        });
        return null;
    }
    return tipoValidado.data;
};

// =======================================================
// 🔹 1️⃣ Sincronizar desde un dispositivo específico
// =======================================================
export const sincronizarPlantillasController = async (req: Request, res: Response) => {
    const dispositivoId = parseInt(req.params.dispositivoId);
    const tipo = req.query.tipo || "rostro";

    if (isNaN(dispositivoId)) {
        return res.status(400).json({ success: false, mensaje: "Parámetro 'dispositivoId' inválido." });
    }

    const tipoValidado = validarTipoBiometria(tipo, res);
    if (!tipoValidado) return;

    try {
        logger.info(`🚀 Sincronizando '${tipoValidado}' en dispositivo ID ${dispositivoId}`);
        const resultado = await sincronizarPlantillasDesdeZKAgent(dispositivoId, tipoValidado);

        return res.status(200).json({
            success: true,
            mensaje: `✅ Sincronización de '${tipoValidado}' completada.`,
            ...resultado
        });

    } catch (error) {
        logger.error(`❌ Error en sincronización: ${(error as Error).message}`);
        return res.status(500).json({ success: false, mensaje: "Error interno durante la sincronización." });
    }
};

// =======================================================
// 🔹 2️⃣ Sincronizar credenciales faltantes globalmente
// =======================================================
export const sincronizarCredencialesFaltantesController = async (req: Request, res: Response) => {
    const tipo = req.query.tipo;
    const tipoValidado = validarTipoBiometria(tipo, res);
    if (!tipoValidado) return;

    try {
        logger.info(`🔄 Sincronizando credenciales faltantes tipo '${tipoValidado}'`);
        const resultado = await sincronizarCredencialesFaltantes(tipoValidado);

        return res.status(200).json({
            success: true,
            mensaje: `✅ Sincronización de credenciales faltantes (${tipoValidado}) completada.`,
            ...resultado
        });

    } catch (error) {
        logger.error(`❌ Error en sincronización faltantes: ${(error as Error).message}`);
        return res.status(500).json({ success: false, mensaje: "Error al sincronizar credenciales faltantes." });
    }
};

// =======================================================
// 🔹 3️⃣ Obtener estado de credenciales biométricas
// =======================================================
export const obtenerEstadoCredencialesController = async (req: Request, res: Response) => {
    const { tipo = "todo", zonaId } = req.query;

    const tipoValidado = validarTipoBiometria(tipo, res);
    if (!tipoValidado) return;

    if (zonaId && isNaN(Number(zonaId))) {
        return res.status(400).json({ success: false, mensaje: "El parámetro 'zonaId' debe ser numérico." });
    }

    try {
        logger.info(`📊 Consultando estado de credenciales tipo '${tipoValidado}'`);
        const estado = await obtenerEstadoCredenciales(tipoValidado);

        return res.status(200).json({
            success: true,
            total: estado.length,
            data: estado
        });

    } catch (error) {
        logger.error(`❌ Error al obtener estado: ${(error as Error).message}`);
        return res.status(500).json({ success: false, mensaje: "Error interno al consultar estado." });
    }
};
