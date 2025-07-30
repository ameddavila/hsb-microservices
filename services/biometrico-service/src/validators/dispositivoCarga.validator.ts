import { z } from "zod";

export const cargaDispositivoSchema = z.object({
  ip: z.string().min(7),
  tipo: z.enum(["rostro", "huella", "password", "todo"]),
  empleados: z.array(z.string()).optional()
});
