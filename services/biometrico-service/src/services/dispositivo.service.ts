import DispositivoModel from "@/models/dispositivo.model";
import { Request } from "express";

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
