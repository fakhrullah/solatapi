import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import dateFnsTz from "date-fns-tz";
import { isAfter, isBefore, parse as dateParse, } from 'date-fns'
import db from "./db.js";
import ZoneCode from './zone.js';
import { PrayerTime, PrayerTimeOutput } from "./PrayerTimes.js";
import { OutputFormat } from "./generated-types/OutputFormat.js";
import { formatPrayerTimes, getZoneDetail } from "./helpers.js";

const { zonedTimeToUtc } = dateFnsTz;

interface IQuerystring {
  zone: ZoneCode;
  from: string; // start date in format dd-mm-yyyy
  to: string; // end date in format dd-mm-yyyy
  format?: OutputFormat;
}

const timesRouteOpts : RouteShorthandOptions = {
  schema: {
    querystring: {
      type: 'object',
      required: ['zone', 'from'],
      properties: {
        zone: {
          type: "string",
        },
        from: {
          type: 'string'
        },
        to: {
          type: 'string'
        },
        format: {
          type: 'string'
        }
      }
    }
  },
}

const ROUTE_URL: string = '/v2/times';

const timesRouteV2: FastifyPluginAsync = async (fastify, options) => {

  fastify.get<{
    Querystring: IQuerystring
  }>(ROUTE_URL, timesRouteOpts, async (req, reply) => {
    const { zone, from, to, format = 'timestamp' } = req.query;
    const zoneCode = zone.toLowerCase() as ZoneCode;

    try {

      const fromDate = dateParse(from, 'dd-MM-yyyy', new Date());
      const toDate = dateParse(to ?? from, 'dd-MM-yyyy', new Date());

      // Validations

      if (isAfter(fromDate, toDate)) {
        throw new Error(`from date MUST be a date before than to date.`);
      }

      if (!Object.values(ZoneCode).includes(zoneCode)) {
        throw new Error(`Zone ${zoneCode} is not available in our database`);
      }

      // Only allow data in 2022 ~ 2023
      if (
        fromDate.getFullYear() < 2022
        || fromDate.getFullYear() > 2023
        || toDate.getFullYear() < 2022
        || toDate.getFullYear() > 2023
      ) {
        throw new Error(`SolatAPI only contains data for 2022 ~ 2023 only`);
      }

      await db.read();

      const startDate = zonedTimeToUtc(fromDate, 'Asia/Kuala_Lumpur');
      const endDate = zonedTimeToUtc(toDate, 'Asia/Kuala_Lumpur');

      const prayerTimesArr: PrayerTime[] = db.data![zoneCode]
        .filter(pt => isAfter(pt.date_timestamp!, startDate.getTime() - 1000))
        .filter(pt => isBefore(pt.date_timestamp!, endDate.getTime() + 1000));

      let formattedPrayerTimes: PrayerTimeOutput[] = prayerTimesArr;

      if (format !== 'timestamp') {
        formattedPrayerTimes = formatPrayerTimes(format, prayerTimesArr);
      }

      return {
        zone_detail: getZoneDetail(zoneCode),
        prayer_times: formattedPrayerTimes
      };

    } catch (error: any) {
      return reply.status(500).send({
        message: error.message,
      });
    }
  });
}

export default timesRouteV2;
