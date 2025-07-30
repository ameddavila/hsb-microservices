import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
} from "sequelize-typescript";
import RoleModel from "./role.model";
import RolePermissionModel from "./rolePermission.model";

@Table({ tableName: "Permissions", timestamps: true })
export default class PermissionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare action: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare module: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description?: string;

  @BelongsToMany(() => RoleModel, () => RolePermissionModel)
  declare roles?: RoleModel[];

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}
