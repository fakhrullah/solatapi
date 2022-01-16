import { FastifyPluginAsync } from "fastify";
import dateFnsTz from "date-fns-tz";
import { isAfter, isBefore, parse as dateParse, } from 'date-fns'
import db from "./db.js";
import ZoneCode from './zone.js';
import { PrayerTime, PrayerTimeOutput } from "./PrayerTimes.js";
import { OutputFormat } from "./generated-types/OutputFormat.js";

const { zonedTimeToUtc, formatInTimeZone } = dateFnsTz;

interface IQuerystring {
  zone: ZoneCode;
  from: string; // start date in format dd-mm-yyyy
  to: string; // end date in format dd-mm-yyyy
  format?: OutputFormat;
}

const formatTimeTo12hour = (datetime: number) => formatInTimeZone(datetime, 'Asia/Kuala_Lumpur', 'p');

const formatTimeTo24hour = (datetime: number) => formatInTimeZone(datetime, 'Asia/Kuala_Lumpur', 'HH:mm:ss');

const formatPrayerTimes = (format: OutputFormat, prayerTimes: PrayerTime[]): PrayerTimeOutput[] => {

  if (format === '12-hour') {
    return prayerTimes.map<PrayerTimeOutput>((prayerTime) => ({
      ...prayerTime,
      imsak: formatTimeTo12hour(prayerTime.imsak!),
      subuh: formatTimeTo12hour(prayerTime.subuh!),
      syuruk: formatTimeTo12hour(prayerTime.syuruk!),
      zohor: formatTimeTo12hour(prayerTime.zohor!),
      asar: formatTimeTo12hour(prayerTime.asar!),
      maghrib: formatTimeTo12hour(prayerTime.maghrib!),
      isyak: formatTimeTo12hour(prayerTime.isyak!)
    }));
  }

  if (format === '24-hour') {
    return prayerTimes.map<PrayerTimeOutput>((prayerTime) => ({
      ...prayerTime,
      imsak: formatTimeTo24hour(prayerTime.imsak!),
      subuh: formatTimeTo24hour(prayerTime.subuh!),
      syuruk: formatTimeTo24hour(prayerTime.syuruk!),
      zohor: formatTimeTo24hour(prayerTime.zohor!),
      asar: formatTimeTo24hour(prayerTime.asar!),
      maghrib: formatTimeTo24hour(prayerTime.maghrib!),
      isyak: formatTimeTo24hour(prayerTime.isyak!)
    }))
  }

  return prayerTimes;
}

const timesRoute: FastifyPluginAsync = async (fastify, options) => {

  fastify.get<{
    Querystring: IQuerystring
  }>('/times', async (req, reply) => {
    const { zone, from, to, format = 'timestamp' } = req.query;
    const zoneCode = zone.toLowerCase() as ZoneCode;

    try {

      const fromDate = dateParse(from, 'dd-MM-yyyy', new Date());
      const toDate = dateParse(to, 'dd-MM-yyyy', new Date());

      // Validation query received
      if (isAfter(fromDate, toDate)) {
        throw new Error(`from date MUST be a date before than to date.`);
      }

      if (!Object.values(ZoneCode).includes(zoneCode)) {
        throw new Error(`Zone ${zoneCode} is not available in our database`)
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
        status: 'success',
        results: formattedPrayerTimes
      };

    } catch (error: any) {
      return reply.status(500).send({
        status: 'FAILED',
        message: error.message,
      });
    }
  })
}

export default timesRoute;
