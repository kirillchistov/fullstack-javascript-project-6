// Локальная замена fastify-objectionjs: регистрирует Knex + Objection и
// декорирует app.objection = { knex, models }. Собственная реализация нужна,
// чтобы не тянуть fastify-objectionjs@2 с peer-зависимостью better-sqlite3,
// которая не собирается на Node 26 (ломает CI Hexlet).
// Поведение повторяет оригинал, включая knexSnakeCaseMappers.

import fp from 'fastify-plugin';
import knexFactory from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';

const objectionPlugin = async (app, { knexConfig, models = [] }) => {
  const knex = knexFactory({
    ...knexConfig,
    ...knexSnakeCaseMappers(),
  });

  Model.knex(knex);

  const modelsByName = models.reduce(
    (acc, model) => ({
      ...acc,
      [model.name.replace(/^\w/, (c) => c.toLowerCase())]: model,
    }),
    {},
  );

  app.decorate('objection', { knex, models: modelsByName });

  app.addHook('onClose', async () => {
    await knex.destroy();
  });
};

export default fp(objectionPlugin, { name: 'fastify-objectionjs' });
