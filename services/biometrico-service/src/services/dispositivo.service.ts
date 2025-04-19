import DispositivoModel from "@/models/dispositivo.model";
import { DispositivoInput } from "@/types/types";
import { Request } from "express";
import { Op } from "sequelize";


export const crearDispositivo = async (data: any, _req: Request) => {
  return await DispositivoModel.create(data);
};

export const obtenerDispositivos = async (_req: Request) => {
  return await DispositivoModel.findAll({
    order: [["nombre", "ASC"]],
  });
};

export const obtenerDispositivoPorId = async (id: number, _req: Request) => {
  return await DispositivoModel.findByPk(id);
};

export const actualizarDispositivo = async (
  id: number,
  data: any,
  _req: Request
) => {
  const dispositivo = await DispositivoModel.findByPk(id);
  if (!dispositivo) return null;

  Object.assign(dispositivo, data);
  await dispositivo.save();

  return dispositivo;
};

export const eliminarDispositivo = async (id: number, _req: Request) => {
  const dispositivo = await DispositivoModel.findByPk(id);
  if (!dispositivo) return false;

  await dispositivo.destroy();
  return true;
};

export const registrarDispositivo = async (input: DispositivoInput) => {
  const { ip, numeroSerie } = input;

  // 🔍 Validar si ya existe por IP o serie
  const existente = await DispositivoModel.findOne({
    where: {
      [Op.or]: [{ ip }, { numeroSerie }]
    }
  });

  if (existente) {
    return { creado: false, dispositivo: existente };
  }

  // ✅ Crear nuevo
  const nuevo = await DispositivoModel.create({
    ...input,
    activo: true,
    fechaRegistro: new Date()
  });

  return { creado: true, dispositivo: nuevo };
};