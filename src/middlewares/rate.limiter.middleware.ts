import rateLimit from "express-rate-limit";
import {ResponseDto} from "../dtos/responses/response.dto";
import * as HttpStatus from "http-status";
import {Request, Response} from 'express';
import config from "../config";

export const RateLimiterMiddleware = (options: any) => {
    let windowMs: number;
    let limit: number;
    let message: string;

    console.log(config.environment);
    
    if (config.environment === 'test') {
        windowMs = 2 * 60 * 1000; //2 minutes;
        limit = 10; //max of 10 requests in 2 minutes
        message = 'Too many requests. Try again in 2 minutes time';
    } else {
        windowMs = options.windowMs || 10 * 1000;
        limit = options.limit || 1;
        message = options.message || 'Too many requests. Try again in 1 minute time';
    }

    return rateLimit({
        windowMs: windowMs,
        limit: limit,
        message: message,
        standardHeaders: true,
        legacyHeaders: false,
        skip: function () {
            return options.skip || false;
        },
        handler: function (req: Request, res: Response) {
            const errorMessage = options.message ?? 'Too many requests. Try again in 1 minute time';
            const errorResponse = new ResponseDto(false, errorMessage);

            return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(errorResponse);
        },
    })
}