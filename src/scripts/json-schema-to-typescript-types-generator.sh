#!/usr/bin/env bash

scriptDir="dirname $0"

cd scriptDir/../
# ls -l

npx json2ts ./schemas/prayer-time.json > ./src/generated-types/PrayerTimes.ts
