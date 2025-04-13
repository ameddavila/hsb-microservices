// src/modules/biometrico/models/zona.model.ts
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

@Table({
  tableName: "zona",
  timestamps: false,
})
export default class ZonaModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  zonaId!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  nombre!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  descripcion?: string;

}
