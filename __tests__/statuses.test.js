// @ts-check

import { faker } from '@faker-js/faker';
import fastify from 'fastify';

import init from '../server/plugin.js';
import {
  getTestData,
  prepareData,
  signInApp,
} from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

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
  });

  it('index authorized', async () => {
    const sessionCookie = await signInApp(app);

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('index not authorized', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('root'));
  });

  it('new', async () => {
    const sessionCookie = await signInApp(app);

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const sessionCookie = await signInApp(app);
    const params = { name: faker.word.adjective() };

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: { data: params },
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('statuses'));

    const status = await models.taskStatus.query().findOne({ name: params.name });
    expect(status).toMatchObject(params);
  });

  it('edit', async () => {
    const existingParams = testData.taskStatuses.existing;
    const statusExisting = await models.taskStatus.query().findOne({ name: existingParams.name });
    const { id } = statusExisting;

    const responseNoAuth = await app.inject({
      method: 'GET',
      url: app.reverse('editStatus', { id }),
    });
    expect(responseNoAuth.statusCode).toBe(302);

    const sessionCookie = await signInApp(app);

    const responseWithAuth = await app.inject({
      method: 'GET',
      url: app.reverse('editStatus', { id }),
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(200);
  });

  it('update', async () => {
    const existingParams = testData.taskStatuses.existing;
    const statusExisting = await models.taskStatus.query().findOne({ name: existingParams.name });
    const { id } = statusExisting;
    const updateParams = testData.taskStatuses.updated;

    const request = {
      method: 'PATCH',
      url: app.reverse('oneStatus', { id }),
      payload: { data: updateParams },
    };

    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);

    const sessionCookie = await signInApp(app);

    const responseWithAuth = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(302);

    const status = await models.taskStatus.query().findOne({ name: updateParams.name });
    expect(status).toMatchObject(updateParams);

    const nonExistentStatus = await models.taskStatus.query()
      .findOne({ name: existingParams.name });
    expect(nonExistentStatus).toBeUndefined();
  });

  it('delete', async () => {
    const existingParams = testData.taskStatuses.unrelated;
    const statusExisting = await models.taskStatus.query().findOne({ name: existingParams.name });
    const { id } = statusExisting;

    const request = {
      method: 'DELETE',
      url: app.reverse('oneStatus', { id }),
    };

    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);

    const sessionCookie = await signInApp(app);

    const responseWithAuth = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(302);

    const status = await models.taskStatus.query().findById(id);
    expect(status).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
