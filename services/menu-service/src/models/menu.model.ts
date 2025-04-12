// ✅ FILE: src/models/menu.model.ts
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
import RoleMenuModel from "./roleMenu.model";

@Table({ tableName: "Menus", timestamps: true })
export default class MenuModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare path: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare icon?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare parentId?: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare sortOrder: number;

  // ✅ Relación many-to-many con Roles
  @BelongsToMany(() => RoleModel, () => RoleMenuModel)
  declare roles?: RoleModel[];

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}
