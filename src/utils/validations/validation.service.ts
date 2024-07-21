import {Service} from "typedi";
import {SignupDto} from "../../dtos/requests/authentication/signup.dto";
import HttpException from "../exceptions/http.exception";
import * as HttpStatus from "http-status";
import {loginSchema, registrationSchema} from "../../schemas/auth.schema";
import {debitWalletSchema, fundWalletSchema} from "../../schemas/wallet.schema";

@Service()
export class ValidationService {
    validatePayload(data: SignupDto, type: string) {
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