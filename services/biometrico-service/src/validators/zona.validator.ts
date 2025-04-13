import { z } from "zod";

export const zonaSchema = z.object({
  nombre: z
    .string()
    .max(100, { message: "El nombre de la zona no puede tener más de 100 caracteres" })
    .nonempty({ message: "El nombre de la zona no puede estar vacío" }),

  descripcion: z.string().nullable().optional(),
});
