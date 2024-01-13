#!/usr/bin/env node

/**
 * ## How to use this script
 * 
 * Using tsx:
 * 
 * Example
 * 
 * ```bash
 * npx tsx ./src/scripts/scrap-solat-time.ts sgr01
 * ```
 */

import ZoneCode from "../zone.js";
import { solatTimeApiPerYear, savePrayerTimesPerYear } from "./scrapper-fns.js";

const zoneCode = process.argv[2];
console.log(zoneCode);

if (!zoneCode) throw new Error(`Zone Code required.`);

if (!Object.values(ZoneCode).includes(zoneCode as ZoneCode)) {
  throw new Error(`Zone Code ${zoneCode} is not valid`);
}

// solatTimeApiPerYear(zoneCode as ZoneCode)
//   .then((data) => {
//     console.log(data);
//   })
//   .catch(err => {
//     throw err;
//   })

savePrayerTimesPerYear(zoneCode as ZoneCode);
