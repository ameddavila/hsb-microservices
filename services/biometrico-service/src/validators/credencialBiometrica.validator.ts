import { z } from "zod";

export const sincronizarPlantillasSchema = z.object({
  ip: z.string({
    required_error: "La IP del dispositivo es obligatoria"
  }).ip("Formato de IP inválido"),

  tipo: z.enum(['todo', 'rostro', 'huella', 'password', 'palma']).default('todo'),

  codigos: z.array(
    z.string().min(1, "El código de empleado no puede estar vacío")
  ).optional()
});
/**
const parsed = sincronizarPlantillasSchema.parse(req.body);
// O si usas query params
const parsed = sincronizarPlantillasSchema.parse(req.query);
*/