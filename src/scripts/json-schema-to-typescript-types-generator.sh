#!/usr/bin/env bash

scriptDir=$(dirname "$0")

echo $scriptDir
cd "$scriptDir/../.."
# ls -l

# npx json2ts ./schemas/prayer-time.json > ./src/generated-types/PrayerTimeOutput.ts
npx json2ts ./schemas/output-format.json > ./src/generated-types/OutputFormat.ts
# npx json2ts ./schemas/zone.json > ./src/generated-types/ZoneCodeGen.ts
