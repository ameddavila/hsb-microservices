import { z } from 'zod';

export const cargoSchema = z.object({
  nombre: z.string().min(3, 'El nombre del cargo es obligatorio').max(100)
});
