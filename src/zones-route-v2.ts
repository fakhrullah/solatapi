import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import ZoneCode from "./zone.js";
import { getAllZoneDetail, getZoneDetail } from "./helpers.js";

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

const ROUTE_URL: string = '/v2/zones/:zone?';

export const zonesRouteV2: FastifyPluginAsync = async (fastify, options) => {
  fastify.get<IZone>(
    ROUTE_URL,
    zonesRouteOpts,
    async (req, reply) => {

      try {
        const { zone } = req.params;

        if (!zone) {
          return getAllZoneDetail();
        }

        // Validation - only query for available zone
        if (!Object.values(ZoneCode).includes(zone)) {
          throw new Error(`Zone ${zone} is not available in our database`)
        }

        return getZoneDetail(zone);

      } catch (error: any) {
        return reply.status(500).send({
          message: error.message ?? 'Error',
        })
      }
    },
  );
}
