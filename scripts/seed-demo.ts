/**
 * Seed script — creates one test user profile per role in Firestore.
 * Run: npx tsx scripts/seed-demo.ts
 *
 * IMPORTANT: This only creates Firestore user docs, NOT Firebase Auth accounts.
 * Create the Auth accounts manually via the app signup with these emails,
 * then this script will upsert the correct role into the user doc.
 *
 * Demo accounts to create in Firebase Console (Authentication tab):
 *   superadmin@demo.com  / Demo1234!
 *   admin@demo.com       / Demo1234!
 *   worker@demo.com      / Demo1234!
 *   citizen@demo.com     / Demo1234!
 *   champion@demo.com    / Demo1234!
 *
 * After creating Auth accounts, get their UIDs from Firebase Console
 * and replace the placeholder UIDs below, then run this script.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const admin = require('firebase-admin');

// Place your Firebase service account key at scripts/serviceAccountKey.json
// Download: Firebase Console → Project Settings → Service Accounts → Generate new private key
// eslint-disable-next-line @typescript-eslint/no-require-imports
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const demoUsers = [
  {
    uid: 'REPLACE_WITH_SUPERADMIN_UID',
    email: 'superadmin@demo.com',
    name: 'Demo Superadmin',
    role: 'Superadmin',
  },
  {
    uid: 'REPLACE_WITH_ADMIN_UID',
    email: 'admin@demo.com',
    name: 'Demo Admin',
    role: 'Admin',
    assignedZone: 'Zone A',
  },
  {
    uid: 'REPLACE_WITH_WORKER_UID',
    email: 'worker@demo.com',
    name: 'Demo Worker',
    role: 'Worker',
    assignedZone: 'Zone A',
  },
  {
    uid: 'REPLACE_WITH_CITIZEN_UID',
    email: 'citizen@demo.com',
    name: 'Demo Citizen',
    role: 'Citizen',
    rewardPoints: 50,
  },
  {
    uid: 'REPLACE_WITH_CHAMPION_UID',
    email: 'champion@demo.com',
    name: 'Demo Champion',
    role: 'Green-Champion',
    rewardPoints: 200,
  },
];

async function seed() {
  console.log('Starting seed...\n');
  for (const user of demoUsers) {
    if (user.uid.startsWith('REPLACE_')) {
      console.log(`⚠️  Skipping ${user.email} — UID not set yet`);
      continue;
    }
    await db.collection('users').doc(user.uid).set({
      ...user,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      memberSince: admin.firestore.FieldValue.serverTimestamp(),
      phone: '',
      address: '',
      citizenID: `CIT-DEMO-${user.role.toUpperCase().replace('-', '')}`,
      preferences: { notifications: true, language: 'en' },
    }, { merge: true });
    console.log(`✓ Seeded: ${user.email} (${user.role})`);
  }
  console.log('\n✅ Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
