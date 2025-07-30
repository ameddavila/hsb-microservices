import { Request, Response } from "express";
import AuditoriaModel from "@models/auditoria.model";

export const registrarAuditoria = async (req: Request, res: Response) => {
    try {
        const { tablaAfectada, accion, usuario, datosAnteriores, datosNuevos, ipUsuario } = req.body;

        await AuditoriaModel.create({
            tablaAfectada,
            accion,
            usuario,
            datosAnteriores,
            datosNuevos,
            ipUsuario
        });

        res.json({ success: true, mensaje: "Auditoría registrada correctamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, mensaje: "Error al registrar auditoría." });
    }
};
