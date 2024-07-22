import {DataTypes, Model} from "sequelize";
import {databaseService} from "../../utils/database";
import {User} from "./user";

const sequelize = databaseService.sequelize;

export class Transfer extends Model {
    id: number;
    amount: string;
    reference: string;
    sender: string;
    recipient: string;
    readonly createdAt: Date;
}

Transfer.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    senderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'id'
        },
        allowNull: false
    },
    recipientId: {
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
    modelName: 'Transfer',
    timestamps: true,
});

Transfer.belongsTo(User, {
    foreignKey: 'senderId',
    onDelete: 'CASCADE',
    as: 'sender'
});

Transfer.belongsTo(User, {
    foreignKey: 'recipientId',
    onDelete: 'CASCADE',
    as: 'recipient'
});