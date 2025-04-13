// ✅ FILE: src/models/rolePermission.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import RoleModel from "./role.model";
import PermissionModel from "./permission.model";

/**
 * Tabla intermedia RolePermissions para relación many-to-many entre Roles y Permisos.
 */
@Table({ tableName: "RolePermissions", timestamps: false })
export default class RolePermissionModel extends Model {
  @ForeignKey(() => RoleModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  declare roleId: number;

  @ForeignKey(() => PermissionModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  declare permissionId: number;

  @BelongsTo(() => RoleModel)
  declare role: RoleModel;

  @BelongsTo(() => PermissionModel)
  declare permission: PermissionModel;
}
