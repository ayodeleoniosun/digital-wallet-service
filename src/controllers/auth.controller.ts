import {Response, Request} from 'express';
import {AuthService} from '../services/auth.service';
import * as HttpStatus from 'http-status';
import {AuthSuccessMessages} from '../utils/enums/messages/authentication/auth.success.messages';
import {ResponseDto} from "../dtos/responses/response.dto";
import {SignupDto} from "../dtos/requests/authentication/signup.dto";
import {LoginDto} from "../dtos/requests/authentication/login.dto";

export class AuthController {
    public constructor(private authService: AuthService) {}

    register = async (req: Request, res: Response) => {
        try {
            const user = await this.authService.register(req.body as SignupDto);

            const successResponse = new ResponseDto(true, AuthSuccessMessages.REGISTRATION_SUCCESSFUL, user);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const response = await this.authService.login(req.body as LoginDto);

            const successResponse = new ResponseDto(true, AuthSuccessMessages.LOGIN_SUCCESSFUL, response);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }
}