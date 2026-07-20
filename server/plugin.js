// Точка входа Fastify-плагина: регистрация middleware, БД, маршрутов и шаблонов.

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import fastifyFormbody from '@fastify/formbody';
import fastifySecureSession from '@fastify/secure-session';
import fastifyPassport from '@fastify/passport';
import fastifySensible from '@fastify/sensible';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import fastifyObjectionjs from 'fastify-objectionjs';
import qs from 'qs';
import Pug from 'pug';
import i18next from 'i18next';

import fastifyMethodOverride from './lib/methodOverride.js';
import rollbarFactory, { getRollbarAccessToken } from './lib/rollbar.js';

import ru from './locales/ru.js';
import en from './locales/en.js';
// @ts-ignore
import addRoutes from './routes/index.js';
import getHelpers from './helpers/index.js';
import * as knexConfig from '../knexfile.js';
import models from './models/index.js';
import FormStrategy from './lib/passportStrategies/FormStrategy.js';

dotenv.config();

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const mode = process.env.NODE_ENV || 'development';

const setUpViews = async (app) => {
  const helpers = getHelpers(app);
  await app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `/assets/${filename}`,
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = async (app) => {
  const pathPublic = path.join(__dirname, '..', 'dist');
  await app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setupLocalization = async () => {
  await i18next
    .init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
        en,
        ru,
      },
    });
};

const addHooks = (app) => {
  app.addHook('preHandler', async (req, reply) => {
    reply.locals = {
      isAuthenticated: () => req.isAuthenticated(),
      getUserId: () => req.user?.id?.toString(),
    };
  });
};

const setUpErrorHandling = (app) => {
  const rollbar = rollbarFactory({
    accessToken: getRollbarAccessToken(),
    environment: mode,
    log: app.log,
  });

  app.setErrorHandler((error, request, reply) => {
    rollbar.error(error, request.raw, (rollbarErr) => {
      if (rollbarErr) {
        request.log.error({ err: rollbarErr }, 'Rollbar reporting failed');
      }
    });
    reply.send(error);
  });
};

const registerPlugins = async (app) => {
  await app.register(fastifySensible);
  await app.register(fastifyReverseRoutes);
  await app.register(fastifyFormbody, { parser: qs.parse });
  // method-override регистрируем до passport (совместимость с Fastify 5)
  await app.register(fastifyMethodOverride);
  await app.register(fastifySecureSession, {
    secret: process.env.SESSION_KEY,
    cookie: {
      path: '/',
    },
  });

  fastifyPassport.registerUserDeserializer(
    (user) => app.objection.models.user.query().findById(user.id),
  );
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
  fastifyPassport.use(new FormStrategy('form', app));
  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());
  await app.decorate('fp', fastifyPassport);
  app.decorate('authenticate', (...args) => fastifyPassport.authenticate(
    'form',
    {
      failureRedirect: app.reverse('root'),
      failureFlash: i18next.t('flash.authError'),
    },
  // @ts-ignore
  )(...args));

  app.decorate('onlyOwnerAccess', async (req, reply) => {
    if (Number(req.params.id) !== req.user.id) {
      req.flash('error', i18next.t('flash.users.onlyOwnerAccess'));
      reply.redirect(app.reverse('users'));
    }
  });

  await app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });
};

export const options = {
  exposeHeadRoutes: false,
};

// eslint-disable-next-line no-unused-vars
export default async (app, _options) => {
  await registerPlugins(app);

  await setupLocalization();
  await setUpViews(app);
  await setUpStaticAssets(app);
  addRoutes(app);
  addHooks(app);
  setUpErrorHandling(app);

  return app;
};
