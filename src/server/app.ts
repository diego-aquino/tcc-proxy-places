import fastify from 'fastify';

import api from '@/clients/api';

import { environment } from '../config/environment';
import { handleServerError } from './errors';

const app = fastify({
  logger: process.env.NODE_ENV !== 'test',
  disableRequestLogging: environment.NODE_ENV !== 'development',
});

app.all('/current/*', async (request, reply) => {
  return api.googleMaps.proxyCurrentPlacesRequest(request, reply);
});

app.all('/new/*', async (request, reply) => {
  return api.googleMaps.proxyNewPlacesRequest(request, reply);
});

app.setErrorHandler(handleServerError);

export default app;
