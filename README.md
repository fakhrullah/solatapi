# Solat API - An API to get prayer times for Malaysia (data scrap from JAKIM)

This API is publicly open at https://solatapi.fajarhac.com.

This API contain data from 2022 to 2023.

## Example request prayer times

Get solat time on 1th June 2023 for Selangor zone 1 ()

```
curl -X GET https://solatapi.fajarhac.com/times?zone=sgr01&from=01-06-2023&format=12-hour
```

Will got result in json:

```JSON
{"status":"success","results":[{"date":"01-Jun-2023","date_timestamp":1685548800000,"imsak":"5:39 AM","subuh":"5:49 AM","syuruk":"7:01 AM","zohor":"1:14 PM","asar":"4:39 PM","maghrib":"7:22 PM","isyak":"8:37 PM"}]}
```