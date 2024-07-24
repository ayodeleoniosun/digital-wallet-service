import {Request, Response} from 'express';
import * as HttpStatus from 'http-status';
import {ResponseDto} from "../dtos/responses/response.dto";
import {ExpressErrorMiddlewareInterface, Middleware} from "routing-controllers";
import {Service} from "typedi";
import HttpException from "../utils/exceptions/http.exception";

@Service()
@Middleware({type: 'after'})
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: HttpException, req: Request, res: Response, next: (err: any) => any) {
        const status = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || 'Something went wrong. Try again';
        const errorResponse = new ResponseDto(false, message);
        res.status(status).json(errorResponse);
        next(error);
    }
}