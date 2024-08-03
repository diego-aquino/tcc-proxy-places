import { AxiosInstance, AxiosResponse } from 'axios';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { DEFAULT_PUBLIC_CACHE_CONTROL_HEADER } from '@/server/cache';

export function proxyResponseToReply(proxiedResponse: AxiosResponse, reply: FastifyReply) {
  delete proxiedResponse.headers['content-length'];
  delete proxiedResponse.headers['transfer-encoding'];

  for (const [headerName, headerValue] of Object.entries(proxiedResponse.headers)) {
    void reply.header(headerName, headerValue);
  }
  if (DEFAULT_PUBLIC_CACHE_CONTROL_HEADER) {
    void reply.header('cache-control', DEFAULT_PUBLIC_CACHE_CONTROL_HEADER);
  }

  return reply.status(proxiedResponse.status).send(proxiedResponse.data);
}

const proxySchema = z.object({
  '*': z.string().min(1),
});

export async function proxyRequest(request: FastifyRequest, reply: FastifyReply, api: AxiosInstance) {
  const { '*': proxiedPath } = proxySchema.parse(request.params);

  delete request.headers.host;
  delete request.headers['content-length'];

  const proxiedResponse = await api({
    url: proxiedPath,
    method: request.method,
    headers: request.headers,
    params: request.query,
    data: request.body,
  });

  return proxyResponseToReply(proxiedResponse, reply);
}
