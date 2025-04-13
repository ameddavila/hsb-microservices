import ZonaModel from "@/models/zona.model";
import { Request } from "express";

/**
 * 🔹 Crear una nueva zona
 */
export const crearZona = async (data: any, _req: Request) => {
  return await ZonaModel.create({
    nombre: data.nombre,
    descripcion: data.descripcion,
    // configId: data.configId, // Descomenta si agregas relación
  });
};

/**
 * 🔹 Obtener todas las zonas
 */
export const obtenerZonas = async (_req: Request) => {
  return await ZonaModel.findAll({
    order: [["nombre", "ASC"]],
  });
};

/**
 * 🔹 Obtener zona por ID
 */
export const obtenerZonaPorId = async (id: number, _req: Request) => {
  return await ZonaModel.findByPk(id);
};

/**
 * 🔹 Actualizar zona existente
 */
export const actualizarZona = async (
  id: number,
  data: any,
  _req: Request
) => {
  const zona = await ZonaModel.findByPk(id);
  if (!zona) return null;

  zona.nombre = data.nombre;
  zona.descripcion = data.descripcion;
  // zona.configId = data.configId; // Si aplica
  await zona.save();

  return zona;
};

/**
 * 🔹 Eliminar zona
 */
export const eliminarZona = async (id: number, _req: Request) => {
  const zona = await ZonaModel.findByPk(id);
  if (!zona) return false;

  await zona.destroy();
  return true;
};
