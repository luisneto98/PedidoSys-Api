import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('Request', table => {
    table
      .string('id', 150)
      .notNullable()
      .primary();

    table
      .integer('requesterId')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('User');

    table.string('description', 250).notNullable();

    table
      .integer('quantity')
      .notNullable()
      .defaultTo(1);

    table
      .float('value')
      .nullable()
      .defaultTo(0);
    table.dateTime('createdDate').notNullable();
    table.dateTime('updatedDate').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('Request');
}
