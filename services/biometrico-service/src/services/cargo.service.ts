import CargoModel from '../models/cargo.model';

export class CargoService {
  async crear(nombre: string) {
    const existente = await CargoModel.findOne({ where: { nombre } });
    if (existente) throw new Error("Este cargo ya existe");

    return await CargoModel.create({ nombre });
  }

  async obtenerTodos() {
    return await CargoModel.findAll({ order: [['nombre', 'ASC']] });
  }
}
