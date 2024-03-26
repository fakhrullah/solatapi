import { PrayerTime } from './PrayerTimes';
import ZoneCode from './zone';

type IDatabase = {
  [x in ZoneCode]: PrayerTime[];
};

import database from './db.json' assert {type: 'json'};

const allData: IDatabase = database as IDatabase;

const dbObj= {
  data: allData
};

// Database structure like this to match lowdb interface
const db = {
  read() {
    return dbObj;
  },
  ...dbObj
}


export default db;
