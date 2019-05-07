const commonSettings = {
  client: 'postgres',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    database: process.env.DATABASE_DB || 'waproject',
    user: process.env.DATABASE_USER || 'docker',
    password: process.env.DATABASE_PASSWORD || '123mudar',
    port: process.env.DATABASE_PORT || 3002
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: __dirname + '/bin/database/migrations'
  },
  seeds: {
    directory: __dirname + '/bin/database/migrations/seeds'
  },
  debug: false
}

module.exports = {
  development: {
    ...commonSettings
  },
  test: {
    ...commonSettings,
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    }
  },

  production: {
    ...commonSettings
  }

};