import { z } from 'zod';

export const fuenteSchema = z.object({
  nombre: z.string().min(3, "El nombre es obligatorio").max(100),
  codigo: z.string().min(1, "El código es obligatorio").max(20)
});
