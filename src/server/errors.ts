import { AxiosError } from 'axios';
import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

import app from '@/server/app';
import { proxyResponseToReply } from '@/utils/network';

export class NotFoundError extends Error {}

export function handleServerError(error: FastifyError, _request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof AxiosError) {
    const formattedError = {
      ...error.toJSON(),
      data: error.response?.data as unknown,
    };

    app.log.error({
      message: 'Request error',
      error: formattedError,
    });

    if (error.response) {
      return proxyResponseToReply(error.response, reply);
    }
  } else {
    app.log.error({
      message: 'Internal server error',
      error,
    });
  }

  return reply.status(500).send({
    message: 'Internal server error',
  });
}
