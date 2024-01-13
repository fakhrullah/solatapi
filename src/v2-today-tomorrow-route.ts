import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import dateFnsTz from "date-fns-tz";
import { addDays, isAfter, isBefore, parse as dateParse, subDays, } from 'date-fns'
import db from "./db.js";
import ZoneCode from './zone.js';
import { PrayerTime, PrayerTimeOutput } from "./PrayerTimes.js";
import { OutputFormat } from "./generated-types/OutputFormat.js";
import { formatPrayerTimes, getZoneDetail } from "./helpers.js";

const { zonedTimeToUtc } = dateFnsTz;

interface IQuerystring {
  format?: OutputFormat
}

interface IParams {
  zone: ZoneCode
  time: 'today' | 'tomorrow' | 'yesterday'
}

const todayRouteOpts: RouteShorthandOptions = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        format: {
          type: 'string'
        }
      }
    },
  },
}

const ROUTE_URL: string = '/v2/:time/:zone';

const todayTomorrowRoutesV2: FastifyPluginAsync = async (fastify, options) => {

  fastify.get<{
    Querystring: IQuerystring
    Params: IParams
  }>(ROUTE_URL, todayRouteOpts, async (req, reply) => {
    const { format = 'timestamp' } = req.query;
    const { zone, time } = req.params;

    const zoneCode = zone.toLowerCase() as ZoneCode;

    try {

      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      
      // Defaul fromDate & toDate for today
      let fromDate = today;

      if (time === 'today') {
        fromDate = today;
      } else if (time === 'tomorrow') {
        const tomorrow = addDays(today, 1);
        fromDate = tomorrow;
      } else if (time === 'yesterday') {
        const yesterday = subDays(today, 1);
        fromDate = yesterday;
      }

      const toDate = fromDate;

      // Validations

      if (!Object.values(ZoneCode).includes(zoneCode)) {
        throw new Error(`Zone ${zoneCode} is not available in our database`);
      }

      // Only allow data in 2022 ~ 2024
      if (
        fromDate.getFullYear() < 2022
        || fromDate.getFullYear() > 2024
        || toDate.getFullYear() < 2022
        || toDate.getFullYear() > 2024
      ) {
        throw new Error(`SolatAPI only contains data for 2022 ~ 2024 only`);
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

export default todayTomorrowRoutesV2;
