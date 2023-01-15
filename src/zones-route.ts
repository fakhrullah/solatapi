import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import ZoneCode from "./zone.js";
import zoneLocationDB from './zone-location-db.json' assert { type: 'json' };

interface IZone {
  Params: {
    zone: ZoneCode | undefined
  },
}

interface IZonesLocation {
  zone: string
  state: string
  locations: string[]
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

      const listOfAllZonesLocation: IZonesLocation[] = zoneLocationDB;

      try {

        if (typeof req.params.zone === 'undefined') {
          // return list of zones
          return {
            status: 'success',
            results: listOfAllZonesLocation,
          }
        }

        const { zone } = req.params;

        // Validation - only query for available zone
        if (!Object.values(ZoneCode).includes(zone)) {
          throw new Error(`Zone ${zone} is not available in our database`)
        }

        return {
          status: 'success',
          results: listOfAllZonesLocation.filter((zoneLocation) => zoneLocation.zone === zone),
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
