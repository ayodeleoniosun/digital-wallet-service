import HttpException from "../utils/exceptions/http.exception";
import {AuthErrorMessages} from '../utils/enums/messages/authentication/auth.error.messages';
import {UserModelDto} from "../dtos/models/authentication/user.model.dto";
import * as HttpStatus from 'http-status';
import {AuthRepository} from "../repositories/authentication/auth.repository";
import {JwtService} from "./jwt.service";
import {Container, Service} from "typedi";
import {comparePassword} from "../utils/helpers/tools";
import {SignupRequestDto} from "../dtos/requests/authentication/signup.request.dto";
import {LoginRequestDto} from "../dtos/requests/authentication/login.request.dto";

@Service()
export class AuthService {
    public jwtService = Container.get(JwtService);
    public authRepository = Container.get(AuthRepository);

    async register(payload: SignupRequestDto): Promise<UserModelDto> {
        const {firstname, lastname, email, password} = payload;

        const emailExists = await this.authRepository.getUserByEmail(email);

        if (emailExists) {
            throw new HttpException(AuthErrorMessages.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
        }

        const {id, createdAt} = await this.authRepository.create({firstname, lastname, email, password});

        return new UserModelDto(id, firstname, lastname, email, createdAt);
    }

    async login(payload: LoginRequestDto) {
        const {email, password} = payload;

        const user = await this.authRepository.getUserByEmail(email);

        if (!user) {
            throw new HttpException(AuthErrorMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const result = comparePassword(password, user.password);

        if (!result) {
            throw new HttpException(AuthErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
        }

        const token = this.jwtService.generateToken(email);

        if (token) {
            return {
                user: new UserModelDto(user.id, user.firstname, user.lastname, user.email, user.createdAt),
                token,
            };
        }
    }
}

