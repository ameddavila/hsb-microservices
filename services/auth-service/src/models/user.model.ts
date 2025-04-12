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
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare username: string;

  @Index({ unique: true })
  @Column({ type: DataType.STRING(100), allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare password: string;

}
