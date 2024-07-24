import {Service} from "typedi";
import HttpException from "../utils/exceptions/http.exception";
import * as HttpStatus from "http-status";

@Service()
export class ValidationService {
    validatePayload(data: any, schema: any) {
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