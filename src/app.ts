import express from 'express';
import {databaseService} from "./utils/database";
import config from './config/index';
import routes from "./routes";

const app: express.Express = express();

databaseService.authenticate();

app.set('port', config.port);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', routes);

export default app;

