/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Daily prayer time
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
  [k: string]: unknown;
}