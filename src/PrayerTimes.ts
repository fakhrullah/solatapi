/**
 * Daily prayer time
 * 
 * PrayerTime is strict data type to be used in code.
 * In API documentation, prayer time output is non-strict for user view.
 */
export interface PrayerTime {
  date?: string;
  date_timestamp?: number;
  imsak?: number;
  subuh?: number;
  syuruk?: number;
  zohor?: number;
  asar?: number;
  maghrib?: number;
  isyak?: number;
}

export interface PrayerTimeOutput{
  date?: string;
  date_timestamp?: number;
  imsak?: number | string;
  subuh?: number | string;
  syuruk?: number | string;
  zohor?: number | string;
  asar?: number | string;
  maghrib?: number | string;
  isyak?: number | string;
}
