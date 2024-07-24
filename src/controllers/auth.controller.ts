import {Response} from 'express';
import {AuthService} from '../services/auth.service';
import * as HttpStatus from 'http-status';
import {AuthSuccessMessages} from '../utils/enums/messages/authentication/auth.success.messages';
import {ResponseDto} from "../dtos/responses/response.dto";
import {Body, JsonController, Post, Res} from "routing-controllers";
import {Container, Service} from "typedi";
import {ValidationService} from "../services/validation.service";
import {SignupRequestDto} from "../dtos/requests/authentication/signup.request.dto";
import {LoginRequestDto} from "../dtos/requests/authentication/login.request.dto";
import {loginSchema, registrationSchema} from "../schemas/auth.schema";

@JsonController('/auth')
@Service()
export class AuthController {
    public authService = Container.get(AuthService);
    public validationService = Container.get(ValidationService);

    @Post('/register')
    async register(@Body() signupDto: SignupRequestDto, @Res() res: Response) {
        try {
            this.validationService.validatePayload(signupDto, registrationSchema());

            const response = await this.authService.register(signupDto);

            const successResponse = new ResponseDto(true, AuthSuccessMessages.REGISTRATION_SUCCESSFUL, response);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    @Post('/login')
    async login(@Body() loginDto: LoginRequestDto, @Res() res: Response) {
        try {
            this.validationService.validatePayload(loginDto, loginSchema());

            const response = await this.authService.login(loginDto);

            const successResponse = new ResponseDto(true, AuthSuccessMessages.LOGIN_SUCCESSFUL, response);

            return res.status(HttpStatus.OK).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }
}