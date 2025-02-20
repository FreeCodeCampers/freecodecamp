import { Type } from '@fastify/type-provider-typebox';

export const updateMyProfileUI = {
  body: Type.Object({
    profileUI: Type.Object({
      isLocked: Type.Boolean(),
      showAbout: Type.Boolean(),
      showCerts: Type.Boolean(),
      showDonation: Type.Boolean(),
      showHeatMap: Type.Boolean(),
      showLocation: Type.Boolean(),
      showName: Type.Boolean(),
      showPoints: Type.Boolean(),
      showPortfolio: Type.Boolean(),
      showTimeLine: Type.Boolean(),
      showCareer: Type.Boolean()
    })
  }),
  response: {
    200: Type.Object({
      message: Type.Literal('flash.privacy-updated'),
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
