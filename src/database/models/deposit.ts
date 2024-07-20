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
  source: {
    allowNull: false,
    type: DataTypes.ENUM,
    values: ['bank_transfer', 'card']
  },
  account_number: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  account_name: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  bank_name: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  last_4_digits: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  auth_token: {
    allowNull: true,
    type: DataTypes.STRING,
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