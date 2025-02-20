import * as Sentry from '@sentry/node';
import type { FastifyError } from 'fastify';

import { SENTRY_DSN, SENTRY_ENVIRONMENT } from './utils/env';

const shouldIgnoreError = (error: FastifyError): boolean => {
  return !!error.statusCode && error.statusCode < 500;
};

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  maxValueLength: 8192, // the default is 250, which is too small.
  beforeSend: (event, hint) =>
    shouldIgnoreError(hint.originalException as FastifyError) ? null : event
});
