import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { JSONFilePreset  } from 'lowdb/node';
import ZoneCode from './zone';
import { PrayerTime } from './PrayerTimes';

type Database = {
  [x in ZoneCode]: PrayerTime[];
};

const dbFile = path.join(dirname(fileURLToPath(import.meta.url)), '../db.json');
const defaultData: Database = {} as Database;

const db = await JSONFilePreset(dbFile, defaultData);

export default db;
