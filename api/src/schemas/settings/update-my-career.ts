import { Type } from '@fastify/type-provider-typebox';

export const updateMyCareer = {
  body: Type.Object({
    career: Type.Array(
      Type.Object({
        title: Type.String(),
        company: Type.String(),
        location: Type.String(),
        start_date: Type.String(),
        end_date: Type.String(),
        description: Type.String()
      })
    )
  }),
  response: {
    200: Type.Object({
      message: Type.Literal('flash.updated-career'),
      type: Type.Literal('success')
    }),
    400: Type.Object({
      message: Type.Literal('flash.wrong-updating'),
      type: Type.Literal('danger')
    }),
    500: Type.Object({
      message: Type.Literal('flash.wrong-updating'),
      type: Type.Literal('danger')
    })
  }
};
