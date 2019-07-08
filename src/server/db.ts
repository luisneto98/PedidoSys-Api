import * as knex from 'knex';
import * as objection from 'objection';
import { IS_TEST } from 'settings';

const config = {
  client: 'postgres',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    database: process.env.DATABASE_DB || 'waproject',
    user: process.env.DATABASE_USER || 'docker',
    password: process.env.DATABASE_PASSWORD || '123mudar',
    port: Number(process.env.DATABASE_PORT) || 3002
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: __dirname + '/../migrations'
  },
  seeds: {
    directory: __dirname + '/../migrations/seeds'
  },
  debug: false
};

const configTest = {
  ...config,
  client: 'sqlite3',
  connection: {
    filename: ':memory:'
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: __dirname + '/../../bin/database/migrations'
  },
  seeds: {
    directory: __dirname + '/../../bin/database/migrations/seeds'
  },
};

export function connect(): knex {
  const connection = knex(IS_TEST ? configTest : config);
  objection.Model.knex(connection);

  return connection;
}

export async function connectAndMigrate(): Promise<knex> {
  const connection = connect();
  objection.Model.knex(connection);

  await connection.migrate.latest();
  await connection.seed.run();

  return connection;
}