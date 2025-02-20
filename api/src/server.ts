// We need to use the triple-slash directive to ensure that ts-node uses the
// reset.d.ts file. It's not possible to import the file directly because it
// is not included in the build (it's a dev dependency).
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./reset.d.ts" />

import './instrument';

import { randomBytes } from 'crypto';

import { FastifyRequest } from 'fastify';
import { isEmpty } from 'lodash';

import { build } from './app';
import {
  FREECODECAMP_NODE_ENV,
  FCC_API_LOG_LEVEL,
  HOST,
  PORT
} from './utils/env';

const requestSerializer = (req: FastifyRequest) => {
  const method = req.method || 'METHOD not found';
  const url = req.url || 'URL not found';
  const headers = req.headers || 'HEADERS not found';
  const xForwardedFor = Array.isArray(req.headers['x-forwarded-for'])
    ? req.headers['x-forwarded-for'][0]
    : req.headers['x-forwarded-for'];
  const ip =
    xForwardedFor || req.headers['x-real-ip'] || req.ip || 'IP not found';
  const query = isEmpty(req.query) ? 'QUERY not found' : req.query;
  const hostname = req.hostname || 'HOSTNAME not found';
  const remotePort = req.socket.remotePort || 'REMOTE_PORT not found';

  return {
    REQ_ID: req.id,
    METHOD: method,
    URL: url,
    IP: ip,
    HOSTNAME: hostname,
    REMOTE_PORT: remotePort,
    QUERY: query,
    HEADERS: headers
  };
};

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    },
    level: FCC_API_LOG_LEVEL || 'info',
    serializers: {
      req: (req: FastifyRequest) => {
        return {
          method: req.method,
          url: req.url
        };
      }
    }
    // No need to redact in development
  },
  production: {
    level: FCC_API_LOG_LEVEL || 'info',
    serializers: {
      req: requestSerializer
    },
    redact: ['req.HEADERS.cookie']
  }
};

const start = async () => {
  const fastify = await build({
    logger: envToLogger[FREECODECAMP_NODE_ENV] ?? true,
    genReqId: () => randomBytes(8).toString('hex'),
    disableRequestLogging: true
  });
  try {
    const port = Number(PORT);
    fastify.log.info(`Starting server on port ${port}`);
    await fastify.listen({ port, host: HOST });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

void start();
