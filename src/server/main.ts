import 'app-module-path/register';
import 'source-map-support/register';

import * as bodyParser from 'body-parser';
import * as timeout from 'connect-timeout';
import * as express from 'express';
import * as logger from 'morgan';

import * as db from './db';
import { allowCors } from './middlewares/allowCors';
import { bindUser } from './middlewares/bindUser';
import * as errors from './middlewares/errors';
import { router as modulesRouter } from './modules/router';
import * as settings from './settings';

db.connect();

const app = express();

if (settings.isProduction) {
    app.use(timeout('5s'));
}

app.use(allowCors);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bindUser);
app.use(logger('dev'));

app.use('/api', modulesRouter);

app.use(errors.notFound);
app.use(errors.parser);

app.use(
    settings.isDevelopment ?
        errors.developmentError :
        errors.productionError
);

app.listen(settings.port, () => console.log(`server started: PORT: ${settings.port} | ENV: ${settings.env}`));

process.on('unhandledRejection', () => { /* ignore */ });
process.on('SIGINT', () => process.exit());