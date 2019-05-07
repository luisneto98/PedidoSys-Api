import * as knex from 'knex';
import * as objection from 'objection';

import * as settings from './settings';

// tslint:disable-next-line
const knexConfig = require('../../knexfile');

export function connect(config: knex.Config = null): knex {
  const connection = knex(config || knexConfig[settings.env]);
  objection.Model.knex(connection);

  return connection;
}

export async function connectAndMigrate(): Promise<knex> {
  const connection = connect();

  await connection.migrate.latest();
  await connection.seed.run();

  return connection;
}