import {DataTypes, Model} from "sequelize";
import {databaseService} from "../../utils/database";
import {comparePassword, hashPassword} from "../../utils/helpers/password.hash";

const sequelize = databaseService.sequelize;
export class User extends Model{
  password: string;

  validatePassword (password: string): boolean {
    return comparePassword(password, this.password);
  }
}

User.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  firstname: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING
  },
  lastname: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING
  },
  email: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },

  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
  hooks: {
    beforeCreate: (user) => {
      user.password = hashPassword(user.password);
    },
  },
});