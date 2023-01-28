import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import { getAllZoneDetail, getZoneDetail } from "./helpers.js";
import ZoneCode from "./zone.js";

interface IZone {
  Params: {
    zone: ZoneCode | undefined
  },
}

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
  fastify.get<IZone>(
    '/zones/:zone?',
    zonesRouteOpts,
    async (req, reply) => {

      try {

        if (typeof req.params.zone === 'undefined') {
          // return list of zones
          return {
            status: 'success',
            results: getAllZoneDetail(),
          }
        }

        const { zone } = req.params;

        // Validation - only query for available zone
        if (!Object.values(ZoneCode).includes(zone)) {
          throw new Error(`Zone ${zone} is not available in our database`)
        }

        return {
          status: 'success',
          results: getZoneDetail(zone),
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
