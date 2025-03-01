import { Model, DataTypes, Sequelize } from 'sequelize';

export class User extends Model {
  public id!: number;
  public balance!: number;
}

export function initUserModel(sequelize: Sequelize): void {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'users',
      sequelize,
      timestamps: false
    }
  );
}
