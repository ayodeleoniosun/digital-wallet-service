import jwt from "jsonwebtoken";
import config from "../config";
import HttpException from "../utils/exceptions/http.exception";
import {AuthErrorMessages} from "../utils/enums/messages/authentication/auth.error.messages";
import * as HttpStatus from 'http-status';
import {Service} from "typedi";

@Service()
export class JwtService {
    generateToken(email: string): string {
        return jwt.sign({email: email}, config.jwt_secret, {expiresIn: '24h'});
    }

    verifyToken(token: string) {
        try {
            return jwt.verify(token, config.jwt_secret);
        } catch (error: any) {
            throw new HttpException(AuthErrorMessages.INVALID_TOKEN, HttpStatus.FORBIDDEN);
        }
    }
}