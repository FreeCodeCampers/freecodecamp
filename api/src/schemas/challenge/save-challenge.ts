import { Type } from '@fastify/type-provider-typebox';
import { file, genericError, savedChallenge } from '../types';

export const saveChallenge = {
  body: Type.Object({
    id: Type.String({
      format: 'objectid',
      maxLength: 24,
      minLength: 24
    }),
    files: Type.Array(file)
  }),
  response: {
    200: Type.Object({
      savedChallenges: Type.Array(savedChallenge)
    }),
    400: Type.Union([
      Type.Literal('That challenge type is not saveable.'),
      Type.Object({
        message: Type.Literal(
          'That does not appear to be a valid challenge submission.'
        ),
        type: Type.Literal('error')
      })
    ]),
    default: genericError
  }
};
