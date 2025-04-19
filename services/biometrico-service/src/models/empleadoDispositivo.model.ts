import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import EmpleadoModel from './empleado.model';
  import DispositivoModel from './dispositivo.model';
  
  @Table({ tableName: 'EmpleadoDispositivo' })
  export default class EmpleadoDispositivoModel extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    empleadoDispositivoId!: number;
  
    @ForeignKey(() => EmpleadoModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empleadoId!: number;
  
    @BelongsTo(() => EmpleadoModel)
    empleado!: EmpleadoModel;
  
    @ForeignKey(() => DispositivoModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    dispositivoId!: number;
  
    @BelongsTo(() => DispositivoModel)
    dispositivo!: DispositivoModel;
  
    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    fechaAsignacion!: Date;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    activo!: boolean;
  }
  