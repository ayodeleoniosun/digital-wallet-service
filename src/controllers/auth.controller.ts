import {Response, Request} from 'express';
import {AuthService} from '../services/auth.service';
import * as HttpStatus from 'http-status';
import {SuccessMessages} from '../utils/enums/success.messages';
import {ResponseDto} from "../dtos/responses/response.dto";
import {SignupDto} from "../dtos/requests/signup.dto";
import {LoginDto} from "../dtos/requests/login.dto";

export class AuthController {
    public constructor(private authService: AuthService) {}

    register = async (req: Request, res: Response) => {
        try {
            const user = await this.authService.register(req.body as SignupDto);

            const successResponse = new ResponseDto(true, SuccessMessages.REGISTRATION_SUCCESSFUL, user);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const response = await this.authService.login(req.body as LoginDto);

            const successResponse = new ResponseDto(true, SuccessMessages.LOGIN_SUCCESSFUL, response);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }
}