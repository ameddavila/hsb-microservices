import { Request, Response } from "express";
import { probarConexion, obtenerUsuarios, obtenerMarcaciones } from "@/services/dispositivo-zkteco.service";
import { obtenerUsuariosConBiometria } from "@/services/dispositivo-zkteco.service";

export const testConexionDispositivo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const info = await probarConexion(id);
    res.json({ conectado: true, info });
  } catch (error: any) {
    res.status(500).json({ conectado: false, error: error.message });
  }
};

export const getUsuariosDispositivo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const usuarios = await obtenerUsuarios(id);
    res.json(usuarios);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMarcacionesDispositivo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const logs = await obtenerMarcaciones(id);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 Usuarios con huella o facial registrados
export const getUsuariosConBiometria = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const usuarios = await obtenerUsuariosConBiometria(id);
    res.json(usuarios);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


import { sincronizarPlantillasDesdeZKAgent } from "@/services/credencialBiometrica.service";

export const sincronizarPlantillasController = async (req: Request, res: Response) => {
  try {
    const { dispositivoId, tipo } = req.body;

    if (!dispositivoId || !tipo) {
      return res.status(400).json({ mensaje: "Faltan parámetros: dispositivoId o tipo" });
    }

    const resultado = await sincronizarPlantillasDesdeZKAgent(dispositivoId, tipo);
    res.json(resultado);
  } catch (error: any) {
    res.status(500).json({ mensaje: error.message });
  }
};
