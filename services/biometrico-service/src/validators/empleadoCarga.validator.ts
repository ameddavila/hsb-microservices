import { z } from "zod";

export const cargarEmpleadosBasicosSchema = z.object({
  dispositivoId: z.number({
    required_error: "El dispositivoId es requerido"
  })
});
