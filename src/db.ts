import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { JSONFile, Low } from 'lowdb';
import ZoneCode from './zone';
import { PrayerTime } from './PrayerTimes';

type Database = {
  [x in ZoneCode]: PrayerTime[];
};

const dbFile = path.join(dirname(fileURLToPath(import.meta.url)), '../db.json');
const dbAdapter = new JSONFile<Database>(dbFile);
const db = new Low<Database>(dbAdapter);

export default db;
