import {DataTypes, Model} from "sequelize";
import {databaseService} from "../../utils/database";
import {User} from "./user";

const sequelize = databaseService.sequelize;

export class Wallet extends Model {
    id: number;
    userId: number;
    balance: number;
    createdAt: Date;
}

Wallet.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
            model: 'User',
            key: 'id'
        },
        allowNull: false
    },
    balance: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.DECIMAL
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
    modelName: 'Wallet',
    timestamps: true,
});

Wallet.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    as: 'owner'
});