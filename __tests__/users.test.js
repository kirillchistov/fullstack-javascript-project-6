// @ts-check

import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import {
  getTestData,
  getNewFakerUser,
  prepareUsersData,
  signInApp,
} from './helpers/index.js';

describe('test users CRUD', () => {
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
    await prepareUsersData(app);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = getNewFakerUser();
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('edit', async () => {
    const existingParams = testData.users.existing;
    const userExisting = await models.user.query().findOne({ email: existingParams.email });
    const { id } = userExisting;

    const request = {
      method: 'GET',
      url: app.reverse('editUser', { id }),
    };

    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);

    const sessionCookie = await signInApp(app);

    const idAnother = 3;
    const responseAnother = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: idAnother }),
      cookies: sessionCookie,
    });
    expect(responseAnother.statusCode).toBe(302);

    const responseWithAuth = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(200);
  });

  it('update', async () => {
    const existingParams = testData.users.existing;
    const userExisting = await models.user.query().findOne({ email: existingParams.email });
    const { id } = userExisting;
    const updateParams = testData.users.update;

    const request = {
      method: 'PATCH',
      url: app.reverse('oneUser', { id }),
      payload: {
        data: updateParams,
      },
    };

    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);
    const userExistingSame = await models.user.query().findById(id);
    expect(userExistingSame).toMatchObject(userExisting);

    const sessionCookie = await signInApp(app);

    const idAnother = 3;
    const responseAnother = await app.inject({
      method: 'PATCH',
      url: app.reverse('oneUser', { id: idAnother }),
      payload: {
        data: updateParams,
      },
      cookies: sessionCookie,
    });
    expect(responseAnother.statusCode).toBe(302);
    const userExistingAnother = await models.user.query().findById(idAnother);
    expect(userExistingAnother.email).toBe('nona_murray@yahoo.com');

    const responseWithAuth = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(302);
    const expected = {
      ..._.omit(updateParams, 'password'),
      passwordDigest: encrypt(updateParams.password),
    };
    const userUpdate = await models.user.query().findById(id);
    expect({ ...userExisting, ...expected }).toMatchObject(userUpdate);
  });

  it('delete', async () => {
    const existingParams = testData.users.existing;
    const userExisting = await models.user.query().findOne({ email: existingParams.email });
    const { id } = userExisting;

    const sessionCookie = await signInApp(app);
    const request = {
      method: 'DELETE',
      url: app.reverse('oneUser', { id }),
    };

    const responseNoAuth = await app.inject(request);
    expect(responseNoAuth.statusCode).toBe(302);
    const userExistingSame = await models.user.query().findById(id);
    expect(userExistingSame).not.toBeUndefined();

    const idAnother = 3;
    const responseAnother = await app.inject({
      method: 'DELETE',
      url: app.reverse('oneUser', { id: idAnother }),
      cookies: sessionCookie,
    });
    expect(responseAnother.statusCode).toBe(302);
    const userExistingAnother = await models.user.query().findById(idAnother);
    expect(userExistingAnother).not.toBeUndefined();

    const responseWithAuth = await app.inject({
      ...request,
      cookies: sessionCookie,
    });
    expect(responseWithAuth.statusCode).toBe(302);
    const userDelete = await models.user.query().findById(id);
    expect(userDelete).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
