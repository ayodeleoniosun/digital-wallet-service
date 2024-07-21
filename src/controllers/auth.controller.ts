import {Response} from 'express';
import {AuthService} from '../services/auth.service';
import * as HttpStatus from 'http-status';
import {AuthSuccessMessages} from '../utils/enums/messages/authentication/auth.success.messages';
import {ResponseDto} from "../dtos/responses/response.dto";
import {SignupDto} from "../dtos/requests/authentication/signup.dto";
import {Body, JsonController, Post, Res} from "routing-controllers";
import {Service} from "typedi";
import {LoginDto} from "../dtos/requests/authentication/login.dto";
import {ValidationService} from "../services/validation.service";

@JsonController('/auth')
@Service()
export class AuthController {
    public constructor(private authService: AuthService, public validationService: ValidationService) {
    }

    @Post('/register')
    async register(@Body() signupDto: SignupDto, @Res() res: Response) {
        try {
            this.validationService.validatePayload(signupDto, 'registration');

            const response = await this.authService.register(signupDto);

            const successResponse = new ResponseDto(true, AuthSuccessMessages.REGISTRATION_SUCCESSFUL, response);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        try {
            this.validationService.validatePayload(loginDto, 'login');

            const response = await this.authService.login(loginDto);

            const successResponse = new ResponseDto(true, AuthSuccessMessages.LOGIN_SUCCESSFUL, response);

            return res.status(HttpStatus.OK).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }
}