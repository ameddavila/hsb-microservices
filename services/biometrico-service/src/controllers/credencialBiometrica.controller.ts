import { Request, Response } from "express";
import { sincronizarPlantillasDesdeZKAgent } from "@/services/credencialBiometrica.service";

export const sincronizarPlantillas = async (req: Request, res: Response) => {
  const { dispositivoId } = req.params;
  const { tipo } = req.query;

  if (!tipo || (tipo !== "finger" && tipo !== "face")) {
    return res.status(400).json({ message: "Tipo inválido: finger o face requerido" });
  }

  try {
    const resultado = await sincronizarPlantillasDesdeZKAgent(Number(dispositivoId), tipo as any);
    res.json(resultado);
  } catch (error) {
    console.error("❌ Error en sincronizarPlantillas:", error);
    res.status(500).json({ message: "Error al sincronizar plantillas", error });
  }
};
