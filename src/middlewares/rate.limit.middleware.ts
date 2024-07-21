import {ExpressMiddlewareInterface} from "routing-controllers";
import {Service} from "typedi";
import rateLimit from "express-rate-limit";
import {ResponseDto} from "../dtos/responses/response.dto";
import * as HttpStatus from "http-status";

@Service()
export class RateLimitMiddleware implements ExpressMiddlewareInterface {
    use(req: any, res: any, next?: (err?: any) => any): Promise<any> {
        rateLimit({
            windowMs: 15 * 1000, // 1 minute
            max: 100, // limit each IP/user to 1 requests per 15 seconds
            keyGenerator: function (req) {
                return req.user.id; // use user ID as the key
            },
            handler: function (req, res, next) {
                const errorResponse = new ResponseDto(false, "Too many requests, please try again later.");

                return res.status(HttpStatus.TOO_MANY_REQUESTS).json(errorResponse);
            },
        });
    }
}