// @ts-check

import { faker } from '@faker-js/faker';
import fastify from 'fastify';

import init from '../server/plugin.js';
import {
  getTestData,
  prepareData,
  signInApp,
} from './helpers/index.js';

describe('test labels CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();
  let sessionCookie;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
    sessionCookie = await signInApp(app);
  });

  it('index authorized', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('index not authorized', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('root'));
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = { name: faker.word.adjective() };

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: { data: params },
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);

    const label = await models.label.query().findOne({ name: params.name });
    expect(label).toMatchObject(params);
  });

  it('edit', async () => {
    const existingParams = testData.labels.existing;
    const labelExisting = await models.label.query().findOne({
      name: existingParams.name,
    });
    const { id } = labelExisting;

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editLabel', { id }),
      cookies: sessionCookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const existingParams = testData.labels.existing;
    const labelExisting = await models.label.query().findOne({
      name: existingParams.name,
    });
    const { id } = labelExisting;
    const updateParams = testData.labels.updated;

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('oneLabel', { id }),
      payload: { data: updateParams },
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);

    const label = await models.label.query().findOne({ name: updateParams.name });
    expect(label).toMatchObject(updateParams);
  });

  it('delete unrelated', async () => {
    const existingParams = testData.labels.unrelated;
    const labelExisting = await models.label.query().findOne({
      name: existingParams.name,
    });
    const { id } = labelExisting;

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('oneLabel', { id }),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);
    expect(await models.label.query().findById(id)).toBeUndefined();
  });

  it('delete in use', async () => {
    const existingParams = testData.labels.existing;
    const labelExisting = await models.label.query().findOne({
      name: existingParams.name,
    });
    const { id } = labelExisting;

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('oneLabel', { id }),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);
    expect(await models.label.query().findById(id)).toBeDefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
