import * as dateFnsTz from 'date-fns-tz';
import { JSONFilePreset  } from 'lowdb/node';
import fetch from "node-fetch";
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import { format as dateFormat, parse as dateParse } from 'date-fns';
import { PrayerTime } from "../PrayerTimes.js";
import { stringToDate } from "../helpers.js";
import ZoneCode from "../zone.js";

const { zonedTimeToUtc } = dateFnsTz;

interface PrayerTimesPerDayRaw {
  hijri: string;
  date: string;
  day: string;
  imsak: string;
  fajr: string;
  syuruk: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

type IDatabase = {
  [x in ZoneCode]: PrayerTime[];
} | {};

const buildApiUrl = (zoneCode: ZoneCode) => {
  // const url = `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=month&zone=${zoneCode}`;
  const url = `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=year&zone=${zoneCode}`;
  return url;
}

const solatTimeApiPerYear = async (zoneCode: ZoneCode): Promise<PrayerTimesPerDayRaw[]> => {
  const url = buildApiUrl(zoneCode);
  const result = await fetch(url);
  const responseJson: any = await result.json();
  const prayerTimes: PrayerTimesPerDayRaw[] = responseJson.prayerTime;
  return prayerTimes;
}

const savePrayerTimesPerYear = async (zoneCode: ZoneCode, year?: number) => {
  const thisYear = year === undefined ? (new Date()).getFullYear(): year;
  const dbFile = path.join(dirname(fileURLToPath(import.meta.url)), `../../db-${year}.json`);
  const db = await JSONFilePreset<IDatabase>(dbFile, {} as IDatabase);

  await db.read();

  db.data ||= {};

  const prayerTimesRaw = await solatTimeApiPerYear(zoneCode);

  const prayerTimesConverted = prayerTimesRaw.map(prayerTime => {

    const timestamp = stringToDate(prayerTime.date).getTime();

    const getDateTimestamp = (time: string) => {
      const formatedDate = dateFormat(timestamp, 'dd-MM-yyyy');
      const dateTime = `${formatedDate} ${time}`;
      const datetimeInKL = dateParse(dateTime, 'dd-MM-yyyy HH:mm:ss', new Date());
      // console.log(dateTime);
      return zonedTimeToUtc(datetimeInKL, 'Asia/Kuala_Lumpur');
    }

    const formattedPrayerTime: PrayerTime = {
      date: prayerTime.date,
      date_timestamp: timestamp,
      imsak: getDateTimestamp(prayerTime.imsak).getTime(),
      subuh: getDateTimestamp(prayerTime.fajr).getTime(),
      syuruk: getDateTimestamp(prayerTime.syuruk).getTime(),
      zohor: getDateTimestamp(prayerTime.dhuhr).getTime(),
      asar: getDateTimestamp(prayerTime.asr).getTime(),
      maghrib: getDateTimestamp(prayerTime.maghrib).getTime(),
      isyak: getDateTimestamp(prayerTime.isha).getTime(),
    }

    return formattedPrayerTime;
  });

  console.log(prayerTimesConverted);

  // @ts-ignore
  db.data[zoneCode] = prayerTimesConverted;

  await db.write();

  console.log(`DONE: For ${zoneCode}`);
}

// export default solatTimeApiPerYear;
export {
  solatTimeApiPerYear,
  savePrayerTimesPerYear,
}
