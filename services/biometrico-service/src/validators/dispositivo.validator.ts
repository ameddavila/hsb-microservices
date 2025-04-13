import { z } from "zod";

export const dispositivoSchema = z.object({
  zonaId: z
    .number({ required_error: "La zona es obligatoria" })
    .int("Debe ser un número entero"),

  nombre: z
    .string()
    .min(1, "El nombre del dispositivo no puede estar vacío"),

  numeroSerie: z
    .string()
    .min(1, "El número de serie es obligatorio"),

  ip: z
    .string()
    .regex(
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "IP no válida"
    ),

  puerto: z
    .number()
    .int("Debe ser un número entero")
    .min(1, "Puerto inválido"),

  ubicacion: z
    .string()
    .min(1, "La ubicación es obligatoria"),

  modelo: z
    .string()
    .min(1, "El modelo es obligatorio"),

  activo: z
    .boolean()
    .optional(),

  fechaRegistro: z
    .string()
    .datetime({ message: "La fecha debe tener formato válido" })
    .optional(),
});
