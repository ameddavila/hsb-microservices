// src/models/role.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import MenuModel from "./menu.model";
import RoleMenuModel from "./roleMenu.model";

@Table({ tableName: "Roles", timestamps: false })
export default class RoleModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING(50) })
  declare name: string;

  @BelongsToMany(() => MenuModel, () => RoleMenuModel)
  declare menus?: MenuModel[];
}
