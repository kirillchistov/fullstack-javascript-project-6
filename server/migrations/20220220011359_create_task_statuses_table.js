// @ts-check
// Миграция Knex: создание таблицы task_statuses.

/** @param {import('knex').Knex} knex */
export const up = (knex) => (
  knex.schema.createTable('task_statuses', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
);

/** @param {import('knex').Knex} knex */
export const down = (knex) => knex.schema.dropTable('task_statuses');
