import {
  Table,
  Column,
  Model,
  Index,
  DataType
} from "sequelize-typescript";

@Table({ tableName: "Users", timestamps: true })
export default class UserModel extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true
  })
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

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare updatedAt: Date;
}
