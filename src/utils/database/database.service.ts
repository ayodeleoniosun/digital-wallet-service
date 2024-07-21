import {Sequelize} from "sequelize";
import config from '../../config/index';
import {DialectType} from './dialect.types';

export class DatabaseService {
    public sequelize: Sequelize;

    public constructor(public dialect: DialectType) {
        this.sequelize = new Sequelize(
            config.database.name,
            config.database.username,
            config.database.password, {
            host: 'localhost',
            dialect: dialect
        });
    }

    async authenticate() {
        try {
            await this.sequelize.authenticate();
            console.log("Database successfully connected");
        } catch (error) {
            console.error("Unable to connect to the database: ", error);
        }
    }
}