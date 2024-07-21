import HttpException from "../utils/exceptions/http.exception";
import {AuthErrorMessages} from '../utils/enums/messages/authentication/auth.error.messages';
import {SignupDto} from "../dtos/requests/authentication/signup.dto";
import {UserModelDto} from "../dtos/models/authentication/user.model.dto";
import * as HttpStatus from 'http-status';
import {AuthRepository} from "../repositories/authentication/auth.repository";
import {LoginDto} from "../dtos/requests/authentication/login.dto";
import {Jwt} from "../utils/helpers/jwt";
import {Service} from "typedi";

@Service()
export class AuthService {
    public constructor(private authRepository: AuthRepository, public jwt: Jwt) {
    }

    async register(payload: SignupDto): Promise<UserModelDto> {
        const {firstname, lastname, email, password} = payload;

        const emailExists = await this.authRepository.getUserByEmail(email);

        if (emailExists) {
            throw new HttpException(AuthErrorMessages.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
        }

        const {id, createdAt} = await this.authRepository.create({firstname, lastname, email, password});

        return new UserModelDto(id, firstname, lastname, email, createdAt);
    }

    async login(payload: LoginDto) {
        const {email, password} = payload;

        const user = await this.authRepository.getUserByEmail(email);

        if (!user) {
            throw new HttpException(AuthErrorMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const result = user.validatePassword(password);

        if (!result) {
            throw new HttpException(AuthErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
        }

        const token = this.jwt.generateToken(email);

        if (token) {
            return {
                user: new UserModelDto(user.id, user.firstname, user.lastname, user.email, user.createdAt),
                token,
            };
        }
    }
}

