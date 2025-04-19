import axios from "axios";
import CredencialBiometricaModel from "@/models/credencialBiometrica.model";
import DispositivoModel from "@/models/dispositivo.model";
import { PlantillaZK } from "@/types/PlantillaZK";

export const sincronizarPlantillasDesdeZKAgent = async (
  dispositivoId: number,
  tipo: "finger" | "face"
) => {
  const dispositivo = await DispositivoModel.findByPk(dispositivoId);
  if (!dispositivo) throw new Error("Dispositivo no encontrado");

  const { ip, puerto } = dispositivo;

  const response = await axios.get<PlantillaZK[]>("http://localhost:5172/api/plantillas", {
    params: { ip, puerto, type: tipo },
  });

  const plantillas = response.data;

  // Guardar en base de datos
  for (const p of plantillas) {
    await CredencialBiometricaModel.upsert({
      empleadoId: p.empleadoId,
      tipo: p.tipo,
      dedo: p.dedo ?? null,
      valor: Buffer.from(p.plantilla, "base64"),
    });
  }

  return {
    total: plantillas.length,
    mensaje: "Plantillas sincronizadas correctamente",
  };
};
