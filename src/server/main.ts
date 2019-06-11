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

const connection = db.connect();

const app = express();

if (settings.IS_PROD) {
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
  settings.IS_DEV ?
    errors.developmentError :
    errors.productionError
);

const server = app.listen(settings.PORT, () => console.log(`server started: PORT: ${settings.PORT} | ENV: ${settings.ENV}`));

process.on('unhandledRejection', (reason: any, p: any) => {
  console.error('unhandledRejection');
  console.error(reason);
  console.error(p);
});

process.on('SIGTERM', async () => {
  console.error('SIGMTERM - fechando servidor');
  await new Promise(resolve => server.close(() => resolve()));
  console.error('SIGMTERM - servidor fechado');

  console.error('SIGMTERM - mongoose disconect');
  await connection.destroy();
  console.error('SIGMTERM - mongoose disconect success');

  console.error('SIGMTERM - finalizando processo');
  process.exit(0);
});