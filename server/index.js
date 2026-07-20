// Запуск HTTP-сервера в production (Render): без fastify-cli, напрямую через Fastify.

import dotenv from 'dotenv';
import fastify from 'fastify';
import init, { options } from './plugin.js';

dotenv.config();

// На macOS порт 5000 часто занят AirPlay — локальный дефолт 5001 (см. .env.example)
const port = Number(process.env.PORT) || 5001;
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
