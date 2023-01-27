import dateFnsTz from 'date-fns-tz';
import { format as dateFormat, parse as dateParse, formatISO as dateFormatISO } from 'date-fns';
// import { LocalStorage } from 'lowdb/lib';
import ZoneCode from './zone';
import zoneLocationDB from './zone-location-db.json' assert { type: 'json' };
import { OutputFormat } from './generated-types/OutputFormat';
import { PrayerTime, PrayerTimeOutput } from './PrayerTimes';

const { zonedTimeToUtc, formatInTimeZone } = dateFnsTz;

export const stringToDate = (stringDate: string): Date => {
  const date = dateParse(stringDate, 'dd-MMM-yyyy', new Date());
  const datetimeInUtc = zonedTimeToUtc(date, 'Asia/Kuala_Lumpur');
  return datetimeInUtc;
}

// const Dec31thInKL = stringToDate('31-Jan-2022');
// console.log(Dec31thInKL);
// console.log('Kuala Lumpur', ' - ', dateFormat(Dec31thInKL, 'd-M-yyyy hh:mm:ss'));
// console.log('ISO datetime', ' - ', dateFormatISO(Dec31thInKL));
// console.log('UTC', ' - ', toDate(Dec31thInKL));
// console.log(stringToDate('01-Mar-2022'))


// {
//   hijri: '1443-06-28',
//   date: '31-Jan-2022',
//   day: 'Monday',
//   imsak: '06:07:00',
//   fajr: '06:17:00',
//   syuruk: '07:27:00',
//   dhuhr: '13:29:00',
//   asr: '16:51:00',
//   maghrib: '19:28:00',
//   isha: '20:40:00'
// }

export interface IZoneDetail {
  zone: string
  state: string
  locations: string[]
}

export const getZoneDetail = (zoneCode: ZoneCode): IZoneDetail => {
  const getZoneDetail = zoneLocationDB.find((zoneDetail) => zoneDetail.zone === zoneCode);

  if (!getZoneDetail) {
    throw new Error('Zone ' + zoneCode + 'is not found');
  }

  return getZoneDetail;
}

export const getAllZoneDetail = (): IZoneDetail[] => zoneLocationDB;

const formatTimeTo12hour = (datetime: number) => formatInTimeZone(datetime, 'Asia/Kuala_Lumpur', 'p');

const formatTimeTo24hour = (datetime: number) => formatInTimeZone(datetime, 'Asia/Kuala_Lumpur', 'HH:mm:ss');

export const formatPrayerTimes = (format: OutputFormat, prayerTimes: PrayerTime[]): PrayerTimeOutput[] => {

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
    }));
  }

  return prayerTimes;
}