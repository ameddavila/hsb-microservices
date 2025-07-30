import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  PrimaryKey,
  Default,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import RoleModel from "./role.model";
import UserRoleModel from "./userRole.model";

export interface UserAttributes {
  id: string;
  dni: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  profileImage?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}


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

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare profileImage?: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare passwordResetToken?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare passwordResetExpires?: Date;

  @BelongsToMany(() => RoleModel, () => UserRoleModel)
  declare roles?: RoleModel[];

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  declare updatedAt: Date;
}
