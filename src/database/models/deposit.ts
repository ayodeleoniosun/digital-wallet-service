import {DataTypes, Model} from "sequelize";
import {databaseService} from "../../utils/database";

const sequelize = databaseService.sequelize;

export class Deposit extends Model{}

Deposit.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id'
    },
    allowNull: false
  },
  amount: {
    allowNull: false,
    type: DataTypes.DECIMAL
  },
  reference: {
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
  deletedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'Deposit',
  timestamps: true,
});