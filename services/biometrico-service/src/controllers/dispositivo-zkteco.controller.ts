import { Request, Response } from "express";
import {
  probarConexion,
  obtenerUsuarios,
  obtenerMarcaciones,
  obtenerUsuariosConBiometria
} from "@/services/dispositivo-zkteco.service";


/**
 * ESTE SE ENCARGA DE LA CONEXION CON ZK-BIOAGENT
 */

import { sincronizarPlantillasDesdeZKAgent } from "@/services/credencialBiometrica.service";

// 🔌 Probar conexión a dispositivo
export const testConexionDispositivo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const info = await probarConexion(id);
    res.json({ conectado: true, info });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    res.status(500).json({ conectado: false, error: mensaje });
  }
};

// 👤 Obtener lista de usuarios del dispositivo
export const getUsuariosDispositivo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const usuarios = await obtenerUsuarios(id);
    res.json(usuarios);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: mensaje });
  }
};

// 🕒 Obtener marcaciones del dispositivo
export const getMarcacionesDispositivo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const logs = await obtenerMarcaciones(id);
    res.json(logs);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: mensaje });
  }
};

// 📸 + ✋ Usuarios con rostro o huella
export const getUsuariosConBiometria = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const usuarios = await obtenerUsuariosConBiometria(id);
    res.json(usuarios);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: mensaje });
  }
};

// 🔄 Sincronizar plantillas biométricas: rostro, huella o contraseña
export const sincronizarPlantillasController = async (req: Request, res: Response) => {
  try {
    const { dispositivoId, tipo } = req.body;

    if (!dispositivoId || !tipo) {
      return res.status(400).json({
        success: false,
        mensaje: "Faltan parámetros requeridos: dispositivoId y tipo"
      });
    }

    const tipoValido = ["rostro", "huella", "password"];
    if (!tipoValido.includes(tipo)) {
      return res.status(400).json({
        success: false,
        mensaje: `Tipo inválido. Debe ser uno de: ${tipoValido.join(", ")}`
      });
    }

    const resultado = await sincronizarPlantillasDesdeZKAgent(dispositivoId, tipo);
    return res.json({ success: true, ...resultado });

  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      mensaje: "Error al sincronizar plantillas",
      detalle: mensaje
    });
  }
};
