import DepartamentoModel from '../models/departamento.model';

export class DepartamentoService {
  async crear(nombre: string) {
    const existente = await DepartamentoModel.findOne({ where: { nombre } });
    if (existente) throw new Error("Este departamento ya existe");

    return await DepartamentoModel.create({ nombre });
  }

  async obtenerTodos() {
    return await DepartamentoModel.findAll({ order: [['nombre', 'ASC']] });
  }
}
