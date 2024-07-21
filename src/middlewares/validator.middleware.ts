import {Request, Response} from 'express';
import * as HttpStatus from 'http-status';

export function validateRequest(req: Request, res: Response, next, schema) {
    const {error, value} = schema.validate(req.body);
    console.log(error);

    if (error) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            success: false,
            message: error.details[0].message,
        });
    } else {
        req.body = value;
        next();
    }
}
