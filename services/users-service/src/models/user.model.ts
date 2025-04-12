import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  PrimaryKey,
  Default,
  BelongsToMany,
} from "sequelize-typescript";
import RoleModel from "./role.model";
import UserRoleModel from "./userRole.model";

@Table({ tableName: "Users", timestamps: true })
export default class UserModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index({ unique: true })
  @Column({ type: DataType.STRING(20), allowNull: false })
  declare dni: string;

  @Index({ unique: true })
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare username: string;

  @Index({ unique: true })
  @Column({ type: DataType.STRING(100), allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare firstName: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare lastName: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare phone?: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isActive: boolean;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare profileImage?: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare passwordResetToken?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare passwordResetExpires?: Date;

  @BelongsToMany(() => RoleModel, () => UserRoleModel)
  declare roles?: RoleModel[];
}
