import fetch from "node-fetch";
import ZoneCode from "../zone.js";

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

const buildApiUrl = (zoneCode: ZoneCode) => {
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

export default solatTimeApiPerYear;
