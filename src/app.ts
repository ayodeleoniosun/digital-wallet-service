import express from 'express';
import 'reflect-metadata';
import {databaseService} from "./utils/database";
import config from './config/index';
import {Container} from 'typedi';
import {Action, useContainer as routingUseContainer, useExpressServer} from 'routing-controllers';
import path from "path";
import {AuthMiddleware} from "./middlewares/auth.middleware";
import {ResponseDto} from "./dtos/responses/response.dto";
import * as HttpStatus from "http-status";

const app: express.Express = express();

databaseService.authenticate();

routingUseContainer(Container);

app.set('port', config.port);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

useExpressServer(app, {
    defaultErrorHandler: false,
    routePrefix: '/api',
    cors: true,
    controllers: [path.join(__dirname, '/controllers/*.ts')],
    middlewares: [path.join(__dirname, '/middlewares/*.ts')],

    currentUserChecker: async (action: Action) => {
        const authMiddleware = Container.get(AuthMiddleware);

        try {
            return await authMiddleware.authenticate(action.request);
        } catch (error) {
            const errorResponse = new ResponseDto(false, error.message);

            return action.response.status(error.statusCode ?? HttpStatus.UNAUTHORIZED).json(errorResponse);
        }
    }
});

export default app;

