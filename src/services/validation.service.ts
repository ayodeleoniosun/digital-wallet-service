import {Service} from "typedi";
import HttpException from "../utils/exceptions/http.exception";
import * as HttpStatus from "http-status";
import {loginSchema, registrationSchema} from "../schemas/auth.schema";
import {debitWalletSchema, fundWalletSchema, transferSchema} from "../schemas/wallet.schema";

@Service()
export class ValidationService {
    validatePayload(data: any, type: string) {
        let schema;

        switch (type) {
            case 'registration':
                schema = registrationSchema();
                break;
            case 'login':
                schema = loginSchema();
                break;
            case 'fund-wallet':
                schema = fundWalletSchema();
                break;
            case 'debit-wallet':
                schema = debitWalletSchema()
                break;
            case 'transfer':
                schema = transferSchema()
                break;
        }

        this.validateRequest(schema, data);
    }


    validateRequest(schema, data) {
        const {error, value} = schema.validate(data);

        if (error) {
            throw new HttpException(error.details[0].message, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        return value;
    }
}