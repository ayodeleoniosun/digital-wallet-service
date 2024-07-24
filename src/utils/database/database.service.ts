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
                host: config.database.host,
                dialect: dialect
            });
    }

    async authenticate() {
        try {
            await this.sequelize.authenticate();
            console.log("Database successfully connected to => " + config.database.name);
        } catch (error: any) {
            console.error("Unable to connect to the database: ", error);
        }
    }

    async close() {
        try {
            await this.sequelize.close();
            console.log("Database successfully disconnected");
        } catch (error: any) {
            console.error("Unable to disconnect to the database: ", error);
        }
    }
}