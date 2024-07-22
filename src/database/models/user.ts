import {DataTypes, Model} from "sequelize";
import {databaseService} from "../../utils/database";
import {hashPassword, toTitleCase} from "../../utils/helpers/tools";

const sequelize = databaseService.sequelize;

export class User extends Model {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    createdAt: Date;
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
    fullname: {
        type: DataTypes.VIRTUAL,

        get() {
            return toTitleCase(`${this.firstname} ${this.lastname}`);
        }
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