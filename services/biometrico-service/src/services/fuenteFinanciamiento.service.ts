import FuenteFinanciamientoModel from '../models/fuenteFinanciamiento.model';

export class FuenteFinanciamientoService {
  async crear(nombre: string, codigo: string) {
    const existente = await FuenteFinanciamientoModel.findOne({
      where: { nombre }
    });
    if (existente) throw new Error("Esta fuente ya existe");

    return await FuenteFinanciamientoModel.create({ nombre, codigo });
  }

  async obtenerTodas() {
    return await FuenteFinanciamientoModel.findAll({ order: [['nombre', 'ASC']] });
  }
}
