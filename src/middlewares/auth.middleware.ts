import {JwtService} from "../services/jwt.service";
import {Request} from 'express';
import HttpException from "../utils/exceptions/http.exception";
import {AuthErrorMessages} from "../utils/enums/messages/authentication/auth.error.messages";
import * as HttpStatus from 'http-status';
import {AuthRepository} from "../repositories/authentication/auth.repository";
import {UserModelDto} from "../dtos/models/authentication/user.model.dto";
import {Container, Service} from "typedi";

@Service()
export class AuthMiddleware {
    public jwtService = Container.get(JwtService);
    public authRepository = Container.get(AuthRepository);

    async authenticate(req: Request) {
        if (!req.headers.authorization) {
            throw new HttpException(AuthErrorMessages.UNAUTHENTICATED_USER, HttpStatus.UNAUTHORIZED);
        }

        const auth = req.headers.authorization;

        if (auth.split(' ')[0] !== 'Bearer') {
            throw new HttpException(AuthErrorMessages.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
        }

        const token = auth.split(' ')[1];

        const {email} = this.jwtService.verifyToken(token);

        const user = await this.authRepository.getUserByEmail(email);

        if (!user) {
            throw new HttpException(AuthErrorMessages.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
        }

        const {id, firstname, lastname, email: userEmail, createdAt} = user;

        return new UserModelDto(id, firstname, lastname, userEmail, createdAt);
    }
}