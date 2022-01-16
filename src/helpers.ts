import dateFnsTz from 'date-fns-tz';
import { format as dateFormat, parse as dateParse, formatISO as dateFormatISO } from 'date-fns';
import { LocalStorage } from 'lowdb/lib';

const { zonedTimeToUtc, utcToZonedTime, toDate } = dateFnsTz;

const stringToDate = (stringDate: string): Date => {
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


export {
  stringToDate,
}
