import {User} from "../../database/models/user";
import jwt from "jsonwebtoken";
import config from "../../config";
import crypto from "crypto";
import HttpException from "../exceptions/http.exception";
import {ErrorMessages} from "../enums/error.messages";
import * as HttpStatus from 'http-status';

export const generateToken = async ({email, id}: Partial<User>) => {
    return jwt.sign({id: id, email: email}, config.jwt_secret, {expiresIn: '24h'});
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, config.jwt_secret);
    } catch (err) {
        throw new HttpException(ErrorMessages.INVALID_TOKEN, HttpStatus.FORBIDDEN);
    }
}

export const randomTokenString = async () => {
    return crypto.randomBytes(40).toString('hex');
}