import { z } from 'zod';

export const departamentoSchema = z.object({
  nombre: z.string().min(3, "El nombre es obligatorio").max(100)
});
