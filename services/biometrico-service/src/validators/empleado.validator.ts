import { z } from "zod";

export const empleadoSchema = z.object({
  codigoEmpleado: z.string()
    .min(4, "El código de empleado debe tener al menos 4 caracteres")
    .max(10, "El código de empleado no debe superar los 10 caracteres"),

  nombre: z.string()
    .min(3, "El nombre es obligatorio y debe tener al menos 3 caracteres"),

  dni: z.string()
    .min(7, "El DNI debe tener al menos 7 caracteres")
    .max(10, "El DNI no debe superar los 10 caracteres"),

  email: z.string().email("Formato de email inválido").optional(),

  telefono: z.string()
    .regex(/^\d{7,8}$/, "El teléfono debe tener entre 7 y 8 dígitos")
    .optional(),

  activo: z.boolean().default(true)
});
