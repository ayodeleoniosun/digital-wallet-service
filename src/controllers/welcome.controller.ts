import {Request, Response} from 'express';
import * as HttpStatus from 'http-status';
import {ResponseDto} from "../dtos/responses/response.dto";
import {Body, CurrentUser, Get, JsonController, Res} from "routing-controllers";
import {Service} from "typedi";
import {User} from "../database/models/user";

@JsonController('/')
@Service()
export class WelcomeController {

    @Get('/')
    async index(@Body() req: Request, @Res() res: Response, @CurrentUser() user?: User) {
        try {
            const successResponse = new ResponseDto(true, 'Welcome to wallet system', []);

            return res.status(HttpStatus.OK).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }
}