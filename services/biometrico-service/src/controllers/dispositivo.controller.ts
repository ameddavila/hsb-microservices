import { Request, Response } from "express";
import {
  crearDispositivo,
  obtenerDispositivos,
  obtenerDispositivoPorId,
  actualizarDispositivo,
  eliminarDispositivo,
} from "@/services/dispositivo.service";

import { dispositivoSchema } from "@/validators/dispositivo.validator";

// 🔹 Crear dispositivo
export const crearDispositivoController = async (req: Request, res: Response) => {
  const result = dispositivoSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: result.error.errors.map(e => e.message),
    });
  }

  try {
    const nuevo = await crearDispositivo(result.data, req);
    res.status(201).json(nuevo);
  } catch (err: any) {
    console.error("❌ Error al crear dispositivo:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// 🔹 Obtener todos los dispositivos
export const obtenerDispositivosController = async (req: Request, res: Response) => {
  try {
    const lista = await obtenerDispositivos(req);
    res.json(lista);
  } catch (err) {
    console.error("❌ Error al obtener dispositivos:", err);
    res.status(500).json({ error: "Error al obtener dispositivos" });
  }
};

// 🔹 Obtener dispositivo por ID
export const obtenerDispositivoPorIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const disp = await obtenerDispositivoPorId(id, req);
    if (!disp) {
      return res.status(404).json({ error: "Dispositivo no encontrado" });
    }
    res.json(disp);
  } catch (err) {
    console.error("❌ Error al obtener dispositivo:", err);
    res.status(500).json({ error: "Error al obtener dispositivo" });
  }
};

// 🔹 Actualizar dispositivo
export const actualizarDispositivoController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = dispositivoSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: result.error.errors.map(e => e.message),
    });
  }

  try {
    const actualizado = await actualizarDispositivo(id, result.data, req);
    if (!actualizado) {
      return res.status(404).json({ error: "Dispositivo no encontrado" });
    }
    res.json(actualizado);
  } catch (err: any) {
    console.error("❌ Error al actualizar dispositivo:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// 🔹 Eliminar dispositivo
export const eliminarDispositivoController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const eliminado = await eliminarDispositivo(id, req);
    if (!eliminado) {
      return res.status(404).json({ error: "Dispositivo no encontrado o ya eliminado" });
    }
    res.json({ mensaje: "✅ Dispositivo eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar dispositivo:", err);
    res.status(500).json({ error: "Error al eliminar dispositivo" });
  }
};
