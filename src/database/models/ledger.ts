import {DataTypes, Model} from "sequelize";
import {databaseService} from "../../utils/database";

const sequelize = databaseService.sequelize;

export class Ledger extends Model{}

Ledger.init({
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
  old_balance: {
    allowNull: false,
    type: DataTypes.DECIMAL
  },
  new_balance: {
    allowNull: false,
    type: DataTypes.DECIMAL
  },
  mutator_type: {
    allowNull: false,
    type: DataTypes.STRING
  },
  mutator_id: {
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
  modelName: 'Ledger',
  timestamps: true,
});