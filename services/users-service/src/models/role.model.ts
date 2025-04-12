// ✅ FILE: src/models/role.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

import PermissionModel from "./permission.model";
import RolePermissionModel from "./rolePermission.model";

import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
} from "sequelize";

@Table({ tableName: "Roles", timestamps: true })
export default class RoleModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description?: string;

  // 🔗 Relaciones many-to-many con permisos
  @BelongsToMany(() => PermissionModel, () => RolePermissionModel)
  declare permissions?: PermissionModel[];

  // Métodos utilitarios para permisos
  declare addPermission: BelongsToManyAddAssociationMixin<PermissionModel, number>;
  declare addPermissions: BelongsToManyAddAssociationsMixin<PermissionModel, number>;
  declare getPermissions: BelongsToManyGetAssociationsMixin<PermissionModel>;
  declare setPermissions: BelongsToManySetAssociationsMixin<PermissionModel, number>;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}
