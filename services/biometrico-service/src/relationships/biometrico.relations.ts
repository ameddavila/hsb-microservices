import { Sequelize } from "sequelize-typescript";

import EmpleadoModel from "@/models/empleado.model";
import DepartamentoModel from "@/models/departamento.model";
import FuenteFinanciamientoModel from "@/models/fuenteFinanciamiento.model";
import CargoModel from "@/models/cargo.model";
import CredencialBiometricaModel from "@/models/credencialBiometrica.model";
import PermisoModel from "@/models/permiso.model";
import TipoPermisoModel from "@/models/tipoPermiso.model";
import AsignacionTurnoModel from "@/models/asignacionTurno.model";
import TipoHorarioModel from "@/models/tipoHorario.model";
import DetalleHorarioModel from "@/models/detalleHorario.model";
import MarcacionModel from "@/models/marcacion.model";
import DispositivoModel from "@/models/dispositivo.model";
import ZonaModel from "@/models/zona.model";
import EmpleadoDispositivoModel from '@/models/empleadoDispositivo.model';

/**
 * 🔗 Define todas las relaciones entre modelos del biometrico-service
 */
export const defineRelations = () => {
  // 🔹 Empleado -> Departamento, Cargo, FuenteFinanciamiento
  EmpleadoModel.belongsTo(DepartamentoModel, { foreignKey: "departamentoId" });
  DepartamentoModel.hasMany(EmpleadoModel, { foreignKey: "departamentoId" });

  EmpleadoModel.belongsTo(FuenteFinanciamientoModel, { foreignKey: "fuenteFinanciamientoId" });
  FuenteFinanciamientoModel.hasMany(EmpleadoModel, { foreignKey: "fuenteFinanciamientoId" });

  EmpleadoModel.belongsTo(CargoModel, { foreignKey: "cargoId" });
  CargoModel.hasMany(EmpleadoModel, { foreignKey: "cargoId" });

  // 🔹 Empleado -> Relaciones directas
  EmpleadoModel.hasMany(CredencialBiometricaModel, { foreignKey: "empleadoId" });
  CredencialBiometricaModel.belongsTo(EmpleadoModel, { foreignKey: "empleadoId" });

  EmpleadoModel.hasMany(PermisoModel, { foreignKey: "empleadoId" });
  PermisoModel.belongsTo(EmpleadoModel, { foreignKey: "empleadoId" });

  EmpleadoModel.hasMany(AsignacionTurnoModel, { foreignKey: "empleadoId" });
  AsignacionTurnoModel.belongsTo(EmpleadoModel, { foreignKey: "empleadoId" });

  EmpleadoModel.hasMany(MarcacionModel, { foreignKey: "empleadoId" });
  MarcacionModel.belongsTo(EmpleadoModel, { foreignKey: "empleadoId" });

  // 🔹 Permisos y horarios
  PermisoModel.belongsTo(TipoPermisoModel, { foreignKey: "tipoPermisoId" });
  TipoPermisoModel.hasMany(PermisoModel, { foreignKey: "tipoPermisoId" });

  AsignacionTurnoModel.belongsTo(TipoHorarioModel, { foreignKey: "tipoHorarioId" });
  TipoHorarioModel.hasMany(AsignacionTurnoModel, { foreignKey: "tipoHorarioId" });

  DetalleHorarioModel.belongsTo(TipoHorarioModel, { foreignKey: "tipoHorarioId" });
  TipoHorarioModel.hasMany(DetalleHorarioModel, { foreignKey: "tipoHorarioId" });

  // 🔹 Marcaciones y dispositivos
  MarcacionModel.belongsTo(DispositivoModel, { foreignKey: "dispositivoId" });
  DispositivoModel.hasMany(MarcacionModel, { foreignKey: "dispositivoId" });

  // 🔹 Zona y dispositivos
  DispositivoModel.belongsTo(ZonaModel, { foreignKey: "zonaId" });
  ZonaModel.hasMany(DispositivoModel, { foreignKey: "zonaId" });

  // 🔹 Relación M:N lógica entre Empleado y Dispositivo
EmpleadoModel.hasMany(EmpleadoDispositivoModel, { foreignKey: 'empleadoId' });
EmpleadoDispositivoModel.belongsTo(EmpleadoModel, { foreignKey: 'empleadoId' });

DispositivoModel.hasMany(EmpleadoDispositivoModel, { foreignKey: 'dispositivoId' });
EmpleadoDispositivoModel.belongsTo(DispositivoModel, { foreignKey: 'dispositivoId' });
};
