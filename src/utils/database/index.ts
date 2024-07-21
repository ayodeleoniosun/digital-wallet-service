import {DatabaseService} from "./database.service";
import {DialectType, DialectTypes} from "./dialect.types";

export const databaseService = new DatabaseService(<DialectType>DialectTypes.MYSQL);