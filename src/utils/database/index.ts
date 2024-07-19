import {DatabaseService} from "./DatabaseService";
import {DialectType, DialectTypes} from "./dialect.types";

export const databaseService = new DatabaseService(<DialectType> DialectTypes.MYSQL);