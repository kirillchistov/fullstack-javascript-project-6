// @ts-check
// Миграция Knex: создание таблицы tasks с внешними ключами.

/** @param {import('knex').Knex} knex */
export const up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('description');
    table.integer('status_id').references('id').inTable('task_statuses');
    table.integer('creator_id').references('id').inTable('users');
    table.integer('executor_id').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
);

/** @param {import('knex').Knex} knex */
export const down = (knex) => knex.schema.dropTable('tasks');
