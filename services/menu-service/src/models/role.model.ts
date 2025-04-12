// ✅ FILE: src/models/role.model.ts en menus-service
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

import MenuModel from "./menu.model";
import RoleMenuModel from "./roleMenu.model";

@Table({ tableName: "Roles", timestamps: true })
export default class RoleModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description?: string;

  // 🔗 Menús asociados
  @BelongsToMany(() => MenuModel, () => RoleMenuModel)
  declare menus?: MenuModel[];

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}
