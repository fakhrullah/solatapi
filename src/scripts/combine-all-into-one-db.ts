#!/usr/bin/env node

import { PathLike, existsSync, readFileSync, writeFileSync } from "fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
import ZoneCode from '../zone.js';

const listYears: number[] = [2022, 2023, 2024];
const listOfFiles: PathLike[] = listYears.map((yearNumber) => {
  const file: PathLike = path.join(
    dirname(fileURLToPath(import.meta.url)),
    `../../db-${yearNumber}.json`
  );
  return file;
});

// Validate if all file exists
listOfFiles.forEach(filename => {
    if (!existsSync(filename)) throw new Error(`${filename} not Exist`)
});


// Combined all
const allData = listOfFiles
    .map((fileData) => JSON.parse(readFileSync(fileData).toString()));

const zoneCodeArray: string[] = Object.values(ZoneCode);
// const zoneCodeArray: string[] = ['jhr01', 'jhr02', 'sgr01'];

const dbData: any = {};

zoneCodeArray.forEach((zone) => {
    // Validate data for the zone is exist for the year
    let dbDataZone: any = [];
    allData.forEach((data, index) => {
        if (allData[index][zone] !== undefined) {
            dbDataZone = [...dbDataZone, ...allData[index][zone]]
        }
    })
    dbData[zone] = dbDataZone;
});

writeFileSync('db-test.json', JSON.stringify(dbData));
