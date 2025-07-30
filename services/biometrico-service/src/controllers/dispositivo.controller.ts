import { Request, Response } from "express";
import {
  crearDispositivo,
  obtenerDispositivos,
  obtenerDispositivoPorId,
  actualizarDispositivo,
  eliminarDispositivo,
  registrarDispositivo,
} from "@/services/dispositivo.service";

import { obtenerDispositivosDesdeZKAgent } from "@/services/zkBioagentClient.service";
import { dispositivoSchema } from "@/validators/dispositivo.validator";

// 🔹 Crear nuevo dispositivo con validación Zod
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

// 🔹 Obtener todos los dispositivos registrados
export const obtenerDispositivosController = async (req: Request, res: Response) => {
  try {
    console.log("📥 Solicitud para obtener dispositivos registrados");
    const lista = await obtenerDispositivos(req);
    console.log(`✅ Se obtuvieron ${lista.length} dispositivos`);
    res.json({ success: true, dispositivos: lista });
  } catch (err: any) {
    console.error("❌ Error al obtener dispositivos:", err.message || err);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener dispositivos"
    });
  }
};

// 🔹 Obtener un dispositivo específico por ID
export const obtenerDispositivoPorIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID de dispositivo inválido" });
  }

  try {
    const dispositivo = await obtenerDispositivoPorId(id, req);
    if (!dispositivo) {
      return res.status(404).json({ error: "Dispositivo no encontrado" });
    }
    res.json(dispositivo);
  } catch (err) {
    console.error("❌ Error al obtener dispositivo:", err);
    res.status(500).json({ error: "Error al obtener dispositivo" });
  }
};

// 🔹 Actualizar un dispositivo existente
export const actualizarDispositivoController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

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

// 🔹 Eliminar un dispositivo por ID
export const eliminarDispositivoController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

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

// 🔹 Registrar un dispositivo detectado desde el agente zk-bioagent
export const registrarDispositivoController = async (req: Request, res: Response) => {
  try {
    const resultado = await registrarDispositivo(req.body);
    res.status(201).json({
      success: true,
      creado: resultado.creado,
      dispositivo: resultado.dispositivo
    });
  } catch (error: any) {
    console.error("❌ Error al registrar dispositivo:", error.message);
    res.status(500).json({
      success: false,
      mensaje: "Error al registrar el dispositivo",
      error: error.message
    });
  }
};

// 🔹 Obtener dispositivos activos desde zk-bioagent (por IP)
export const buscarDispositivosEnRed = async (req: Request, res: Response) => {
  const { inicio, fin } = req.query;

  console.log("🔍 Buscando dispositivos en red entre:", inicio, "y", fin);

  if (!inicio || !fin) {
    return res.status(400).json({
      success: false,
      mensaje: "Debes proporcionar los parámetros 'inicio' e 'fin' (rango IP)"
    });
  }

  try {
    const dispositivos = await obtenerDispositivosDesdeZKAgent(String(inicio), String(fin));
    if (dispositivos && dispositivos.length > 0) {
      console.log(`✅ Se detectaron ${dispositivos.length} dispositivos activos.`);
  } else {
      console.log("⚠️ No se detectaron dispositivos activos.");
  }
  
    res.json({ success: true, dispositivos });
  } catch (error: any) {
    console.error("❌ Error al buscar dispositivos en red:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener dispositivos desde zk-bioagent",
      error: error.message
    });
  }
};
