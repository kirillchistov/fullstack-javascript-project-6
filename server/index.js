// Запуск HTTP-сервера в production (Render): без fastify-cli, напрямую через Fastify.

import fastify from 'fastify';
import init, { options } from './plugin.js';

const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || '0.0.0.0';

const app = fastify({
  ...options,
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

await app.register(init);
await app.listen({ port, host });

app.log.info(`Server listening on ${host}:${port}`);
