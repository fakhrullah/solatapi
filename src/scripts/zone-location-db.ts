import { readFileSync, writeFileSync } from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const stateZoneFile = path.join(dirname(fileURLToPath(import.meta.url)), './zone-location.json');
const zoneLocationDB = path.join(dirname(fileURLToPath(import.meta.url)), '../zone-location-db.json');

try {
    const rawData = readFileSync(stateZoneFile);
    const rawStateZones = JSON.parse(rawData.toString());
    
    const zoneLocations = [];
    for (const state in rawStateZones) {
        // console.log(state.toLowerCase());
        for (const zone in rawStateZones[state]) {
            if (Object.prototype.hasOwnProperty.call(rawStateZones[state], zone)) {
                const locations: string[] = rawStateZones[state][zone];
                zoneLocations.push({
                    zone: zone.toLowerCase(),
                    state: state.toLowerCase(),
                    locations: locations.map((location) => location.toLowerCase())
                })
            }
        }
    }

    // console.log(zoneLocations);
    writeFileSync(zoneLocationDB, JSON.stringify(zoneLocations));
} catch (error) {
    throw error;
}


