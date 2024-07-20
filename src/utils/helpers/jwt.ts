import {User} from "../../database/models/user";
import jwt from "jsonwebtoken";
import config from "../../config";
import HttpException from "../exceptions/http.exception";
import {AuthErrorMessages} from "../enums/messages/authentication/auth.error.messages";
import * as HttpStatus from 'http-status';

export class Jwt {
    generateToken({email, id}: Partial<User>): string {
        return jwt.sign({id: id, email: email}, config.jwt_secret, {expiresIn: '24h'});
    }

    verifyToken(token: string) {
        try {
            return jwt.verify(token, config.jwt_secret);
        } catch (err) {
            throw new HttpException(AuthErrorMessages.INVALID_TOKEN, HttpStatus.FORBIDDEN);
        }
    }
}