import {  FastifyPluginAsync } from "fastify";
import ZoneCode from './zone.js';

interface IQuerystring {
  zone: ZoneCode;
  from: string; // start date in format dd-mm-yyyy
  to: string; // end date in format dd-mm-yyyy
  format?: string;
}

const timesRoute: FastifyPluginAsync = async (fastify, options) => {

    fastify.get<{
      Querystring: IQuerystring
    }>('/times', async (req, reply) => {
      const {zone, from, to, format} = req.query;

      return {
        status: 'OK',
        message: 'times'
      }
    })
}

export default timesRoute;
