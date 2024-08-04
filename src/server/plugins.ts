import cors from '@fastify/cors';

import app from './app';

export async function loadPlugins() {
  await app.register(cors, { origin: '*' });
}
