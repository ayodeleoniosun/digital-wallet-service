import {DataTypes, Model} from "sequelize";
import {databaseService} from "../../utils/database";
import {User} from "./user";

const sequelize = databaseService.sequelize;

export class Withdrawal extends Model {
    id: number;
    userId: number;
    amount: number;
    fee: number;
    reference: string;
    account_number: string;
    account_name: string;
    bank_name: string;
    createdAt: Date;
}

Withdrawal.init({
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
    fee: {
        allowNull: false,
        type: DataTypes.DECIMAL
    },
    reference: {
        allowNull: false,
        type: DataTypes.STRING
    },
    account_number: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    account_name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    bank_name: {
        allowNull: false,
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
    modelName: 'Withdrawal',
    timestamps: true,
});

Withdrawal.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    as: 'debitor'
});