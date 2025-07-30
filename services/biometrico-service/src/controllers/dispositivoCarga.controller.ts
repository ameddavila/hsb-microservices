import { Request, Response } from "express";
import dispositivoCargaService from "../services/dispositivoCarga.service";
import { TipoCredencial } from "@/types/types";  // Asegúrate de ajustar la ruta si es necesario

export const cargarEmpleadosAlDispositivo = async (req: Request, res: Response) => {
    try {
        const { ip, tipos, empleados } = req.body;

        const tiposSolicitados: string[] = tipos || [];
        const tiposValidos: TipoCredencial[] = ["rostro", "huella", "password"];

        const tiposIncorrectos = tiposSolicitados.filter((t: string) => !tiposValidos.includes(t as TipoCredencial));

        if (tiposIncorrectos.length > 0) {
            return res.status(400).json({ 
                success: false, 
                mensaje: `❌ Tipos inválidos: ${tiposIncorrectos.join(", ")}` 
            });
        }

        console.log(`📥 Iniciando carga de empleados al dispositivo ${ip}`);
        console.log(`🔑 Tipos solicitados: ${tipos.length > 0 ? tipos.join(", ") : "Todos los tipos"}`);
        console.log(`👥 Empleados: ${empleados.length > 0 ? empleados.join(", ") : "Todos los empleados"}`);

        // 👉 Ahora llamamos al servicio
        const resultado = await dispositivoCargaService.cargarEmpleados({ ip, tipos, empleados });

        console.log("✅ Carga enviada a zk-bioagent.");
        console.log(`📊 Resultado: Procesados ${resultado.detalle.length} empleados.`);

        const errores = resultado.detalle.filter(d => d.status.includes("❌"));
        const exitosos = resultado.detalle.filter(d => d.status.includes("✅"));

        console.log(`✅ Exitosos: ${exitosos.length}`);
        console.log(`❌ Fallidos: ${errores.length}`);

        res.json({ success: true, ...resultado });
    } catch (error: any) {
        console.error("❌ Error en cargarEmpleadosAlDispositivo:", error);
        res.status(500).json({ success: false, mensaje: error.message || "Error desconocido" });
    }
};
