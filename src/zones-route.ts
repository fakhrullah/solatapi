import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

const zonesRouteOpts: RouteShorthandOptions = {
  schema: {
    querystring: {
      type: 'object',
      required: [],
      properties: {
        zone: {
          type: 'string'
        }
      }
    }
  }
}

export const zonesRoute: FastifyPluginAsync = async (fastify, options) => {
  fastify.get(
    '/zones/:zone?',
    zonesRouteOpts,
    async (req, reply) => {
      try {
        return {
          status: 'success',
          message: 'Not implemented yet'
        };

      } catch (error: any) {
        return reply.status(500).send({
          status: 'failed',
          message: error.message ?? 'Error',
        })
      }
    },
  );
}
