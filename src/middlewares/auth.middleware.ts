import {Jwt} from "../utils/helpers/jwt";
import {NextFunction, Request, RequestHandler, Response} from 'express';
import HttpException from "../utils/exceptions/http.exception";
import {AuthErrorMessages} from "../utils/enums/messages/authentication/auth.error.messages";
import * as HttpStatus from 'http-status';
import {AuthRepository} from "../repositories/authentication/auth.repository";
import {UserModelDto} from "../dtos/models/authentication/user.model.dto";
import {ResponseDto} from "../dtos/responses/response.dto";

export class AuthMiddleware {
    constructor(public authRepository: AuthRepository, public jwt: Jwt) {
    }

    authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.user = await this.validateRequest(req);
            return next();
        } catch (error) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.UNAUTHORIZED).json(errorResponse);
        }
    }

    async validateRequest(req: Request) {
        if (!req.headers.authorization) {
            throw new HttpException(AuthErrorMessages.UNAUTHENTICATED_USER, HttpStatus.UNAUTHORIZED);
        }

        const auth = req.headers.authorization;

        if (auth.split(' ')[0] !== 'Bearer') {
            throw new HttpException(AuthErrorMessages.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
        }

        const token = auth.split(' ')[1];

        const {email} = this.jwt.verifyToken(token);

        const user = await this.authRepository.getUserByEmail(email);

        if (!user) {
            throw new HttpException(AuthErrorMessages.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
        }

        const {id, firstname, lastname, email: userEmail, createdAt} = user;

        return new UserModelDto(id, firstname, lastname, userEmail, createdAt);
    }
}