/**
 * Seed script — creates demo cities, zones, and wards in Firestore.
 * Run: npx tsx scripts/seed-locations.ts
 *
 * Idempotent: uses fixed document IDs so reruns overwrite cleanly.
 */

import admin from 'firebase-admin';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = existsSync(join(__dirname, 'serviceAccountKey.json'))
  ? join(__dirname, 'serviceAccountKey.json')
  : join(__dirname, 'service-account.json');

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

interface CityData {
  name: string;
  state: string;
  zones: {
    id: string;
    name: string;
    wards: { id: string; name: string }[];
  }[];
}

const CITIES: CityData[] = [
  {
    name: 'Nagpur',
    state: 'Maharashtra',
    zones: [
      {
        id: 'zone_dharampeth',
        name: 'Dharampeth',
        wards: [
          { id: 'ward_13', name: 'Ward 13' },
          { id: 'ward_14', name: 'Ward 14' },
          { id: 'ward_15', name: 'Ward 15' },
        ],
      },
      {
        id: 'zone_laxminagar',
        name: 'Laxmi Nagar',
        wards: [
          { id: 'ward_21', name: 'Ward 21' },
          { id: 'ward_22', name: 'Ward 22' },
          { id: 'ward_23', name: 'Ward 23' },
        ],
      },
      {
        id: 'zone_hanuman_nagar',
        name: 'Hanuman Nagar',
        wards: [
          { id: 'ward_31', name: 'Ward 31' },
          { id: 'ward_32', name: 'Ward 32' },
        ],
      },
      {
        id: 'zone_nehru_nagar',
        name: 'Nehru Nagar',
        wards: [
          { id: 'ward_41', name: 'Ward 41' },
          { id: 'ward_42', name: 'Ward 42' },
          { id: 'ward_43', name: 'Ward 43' },
        ],
      },
      {
        id: 'zone_satranjipura',
        name: 'Satranjipura',
        wards: [
          { id: 'ward_51', name: 'Ward 51' },
          { id: 'ward_52', name: 'Ward 52' },
        ],
      },
      {
        id: 'zone_lakadganj',
        name: 'Lakadganj',
        wards: [
          { id: 'ward_61', name: 'Ward 61' },
          { id: 'ward_62', name: 'Ward 62' },
          { id: 'ward_63', name: 'Ward 63' },
        ],
      },
    ],
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    zones: [
      {
        id: 'zone_andheri',
        name: 'Andheri',
        wards: [
          { id: 'ward_andheri_1', name: 'K/West Ward' },
          { id: 'ward_andheri_2', name: 'K/East Ward' },
        ],
      },
      {
        id: 'zone_bandra',
        name: 'Bandra',
        wards: [
          { id: 'ward_bandra_1', name: 'H/West Ward' },
          { id: 'ward_bandra_2', name: 'H/East Ward' },
        ],
      },
    ],
  },
  {
    name: 'Delhi',
    state: 'Delhi',
    zones: [
      {
        id: 'zone_south_delhi',
        name: 'South Delhi',
        wards: [
          { id: 'ward_south_1', name: 'Mehrauli Ward' },
          { id: 'ward_south_2', name: 'Vasant Kunj Ward' },
        ],
      },
      {
        id: 'zone_central_delhi',
        name: 'Central Delhi',
        wards: [
          { id: 'ward_central_1', name: 'Connaught Place Ward' },
          { id: 'ward_central_2', name: 'Karol Bagh Ward' },
        ],
      },
    ],
  },
];

async function seed() {
  console.log('🌱 Seeding cities, zones, and wards...\n');

  for (const city of CITIES) {
    const cityId = city.name.toLowerCase().replace(/\s+/g, '_');
    console.log(`📍 City: ${city.name} (${cityId})`);

    await db.collection('cities').doc(cityId).set({
      name: city.name,
      state: city.state,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    for (const zone of city.zones) {
      console.log(`   🟢 Zone: ${zone.name} (${zone.id})`);

      await db.collection('zones').doc(zone.id).set({
        name: zone.name,
        cityId,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      for (const ward of zone.wards) {
        console.log(`      📋 Ward: ${ward.name} (${ward.id})`);

        await db.collection('wards').doc(ward.id).set({
          name: ward.name,
          zoneId: zone.id,
          cityId,
          isActive: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    }
    console.log();
  }

  console.log('✅ Location seed complete.');
}

seed().catch(console.error);
