// @ts-check

import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

const getFixturePath = (filename) => path.join('..', '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(new URL(getFixturePath(filename), import.meta.url), 'utf-8').trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData('testData.json');

export const prepareUsersData = async (app) => {
  const { knex } = app.objection;

  await knex('users').insert(getFixtureData('users.json'));
};

export const prepareStatusesData = async (app) => {
  const { knex } = app.objection;

  await knex('task_statuses').insert(getFixtureData('task_statuses.json'));
};

export const prepareTasksData = async (app) => {
  const { knex } = app.objection;

  await knex('tasks').insert(getFixtureData('tasks.json'));
};

export const prepareLabelsData = async (app) => {
  const { knex } = app.objection;

  await knex('labels').insert(getFixtureData('labels.json'));
};

export const prepareTasksLabelsData = async (app) => {
  const { knex } = app.objection;

  await knex('tasks_labels').insert(getFixtureData('tasks_labels.json'));
};

export const prepareData = async (app) => {
  await prepareUsersData(app);
  await prepareStatusesData(app);
  await prepareTasksData(app);
  await prepareLabelsData(app);
  await prepareTasksLabelsData(app);
};

export const getFakeTask = (withLabels = false) => ({
  name: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  statusId: '1',
  executorId: '1',
  ...(withLabels ? { labels: ['1', '2'] } : {}),
});

export const getNewFakerUser = () => ({
  password: faker.internet.password(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
});

export const signInApp = async (app, params = getTestData().users.existing) => {
  const responseSignIn = await app.inject({
    method: 'POST',
    url: app.reverse('session'),
    payload: {
      data: params,
    },
  });

  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;

  return { [name]: value };
};
