import { type FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { CompletedChapter, CompletedModule } from '@prisma/client';

import * as schemas from '../../schemas';

const getInformationForUpdate = ({
  id: sectionId,
  completedItems,
  completedDate
}: {
  id: undefined | string;
  completedItems: CompletedModule[] | CompletedChapter[];
  completedDate: number;
}) => {
  if (!sectionId) {
    return {
      alreadyCompletedSection: undefined,
      newCompletedSection: completedItems
    };
  }

  const alreadyCompletedSection = completedItems.find(
    ({ id }) => sectionId === id
  );

  const newCompletedSection = alreadyCompletedSection
    ? completedItems
    : {
        push: {
          id: sectionId,
          completedDate
        }
      };

  return { alreadyCompletedSection, newCompletedSection };
};

const getReturnValue = ({
  id,
  alreadyCompletedSection,
  completedDate
}: {
  id: undefined | string;
  alreadyCompletedSection: undefined | CompletedModule | CompletedChapter;
  completedDate: number;
}) => {
  if (!id) return null;

  return {
    id,
    alreadyCompleted: !!alreadyCompletedSection,
    completedDate: alreadyCompletedSection?.completedDate ?? completedDate
  };
};

/**
 * Plugin for the module submission endpoints.
 *
 * @param fastify The Fastify instance.
 * @param _options Options passed to the plugin via `fastify.register(plugin, options)`.
 * @param done The callback to signal that the plugin is ready.
 */
export const curriculumSectionRoutes: FastifyPluginCallbackTypebox = (
  fastify,
  _options,
  done
) => {
  fastify.post(
    '/curriculum-section-completed',
    {
      schema: schemas.curriculumSectionCompleted,
      errorHandler(error, request, reply) {
        if (error.validation) {
          void reply.code(400);
          return {
            type: 'error',
            message:
              'That does not appear to be a valid curriculum section submission.'
          };
        } else {
          fastify.errorHandler(error, request, reply);
        }
      }
    },
    async req => {
      const { moduleId, chapterId } = req.body;
      const userId = req.user?.id;

      const user = await fastify.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          id: true,
          completedModules: true,
          completedChapters: true
        }
      });

      const completedDate = Date.now();

      const {
        alreadyCompletedSection: alreadyCompletedModule,
        newCompletedSection: newCompletedModules
      } = getInformationForUpdate({
        id: moduleId,
        completedItems: user.completedModules,
        completedDate
      });

      const {
        alreadyCompletedSection: alreadyCompletedChapter,
        newCompletedSection: newCompletedChapters
      } = getInformationForUpdate({
        id: chapterId,
        completedItems: user.completedChapters,
        completedDate
      });

      await fastify.prisma.user.update({
        where: { id: user.id },
        data: {
          completedModules: newCompletedModules,
          completedChapters: newCompletedChapters
        }
      });

      return {
        module: getReturnValue({
          id: moduleId,
          alreadyCompletedSection: alreadyCompletedModule,
          completedDate
        }),
        chapter: getReturnValue({
          id: chapterId,
          alreadyCompletedSection: alreadyCompletedChapter,
          completedDate
        })
      };
    }
  );

  done();
};
