// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import {
  getTestData,
  getFakeTask,
  prepareData,
  signInApp,
} from './helpers/index.js';

describe('test tasks CRUD', () => {
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
      url: app.reverse('tasks'),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('index not authorized', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('root'));
  });

  it('new', async () => {
    const responseNoAuth = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
    });
    expect(responseNoAuth.statusCode).toBe(302);

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: sessionCookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('show', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('showTask', { id: 1 }),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = getFakeTask(true);

    const responseNoAuth = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: { data: params },
    });
    expect(responseNoAuth.statusCode).toBe(302);

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: { data: params },
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('tasks'));

    const task = await models.task.query().findOne({ name: params.name })
      .withGraphFetched('labels');
    expect(task).toMatchObject({
      name: params.name,
      description: params.description,
      statusId: Number(params.statusId),
      executorId: Number(params.executorId),
      creatorId: 2,
    });
    expect(task.labels.map(({ id }) => id).sort()).toEqual([1, 2]);
  });

  it('edit', async () => {
    const taskExisting = await models.task.query().findOne({
      name: testData.tasks.existing.name,
    });
    const { id } = taskExisting;

    const responseNoAuth = await app.inject({
      method: 'GET',
      url: app.reverse('editTask', { id }),
    });
    expect(responseNoAuth.statusCode).toBe(302);

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editTask', { id }),
      cookies: sessionCookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const taskExisting = await models.task.query().findOne({
      name: testData.tasks.existing.name,
    });
    const { id } = taskExisting;
    const updateParams = testData.tasks.updated;

    const request = {
      method: 'PATCH',
      url: app.reverse('oneTask', { id }),
      payload: { data: updateParams },
    };

    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);

    const response = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(response.statusCode).toBe(302);

    const task = await models.task.query().findById(id).withGraphFetched('labels');
    expect(task).toMatchObject({
      name: updateParams.name,
      description: updateParams.description,
      statusId: updateParams.statusId,
      executorId: updateParams.executorId,
      creatorId: taskExisting.creatorId,
    });
    expect(task.labels.map(({ id: labelId }) => labelId).sort()).toEqual([1, 2]);
  });

  it('delete by creator', async () => {
    const taskExisting = await models.task.query().findOne({
      name: testData.tasks.existing.name,
    });
    const { id } = taskExisting;

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('oneTask', { id }),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);
    expect(await models.task.query().findById(id)).toBeUndefined();
  });

  it('delete by non-creator', async () => {
    const taskExisting = await models.task.query().findOne({
      name: testData.tasks.alternative.name,
    });
    const { id } = taskExisting;

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('oneTask', { id }),
      cookies: sessionCookie,
    });

    expect(response.statusCode).toBe(302);
    expect(await models.task.query().findById(id)).toBeDefined();
  });

  describe('filtering', () => {
    it('by all options for 1 task', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('tasks'),
        cookies: sessionCookie,
        query: testData.tasks.filter,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toContain(testData.tasks.existing.name);
      expect(response.body).not.toContain(testData.tasks.alternative.name);
    });

    it('by empty options, show all tasks', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('tasks'),
        cookies: sessionCookie,
        query: testData.tasks.filterEmpty,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toContain(testData.tasks.existing.name);
      expect(response.body).toContain(testData.tasks.alternative.name);
    });
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
