import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('UserDevice', table => {
    table
      .integer('userId')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('User')
      .onDelete('CASCADE');

    table.string('deviceId', 150).notNullable();
    table.string('name', 150).notNullable();
    table.uuid('currentToken').notNullable();
    table.string('notificationToken', 250).nullable();

    table.primary(['userId', 'deviceId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('UserDevice');
}
