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
    uid: 'i0Z17SdVAuhrK12zz9dH5CHMUCQ2',
    email: 'superadmin@demo.com',
    name: 'Demo Superadmin',
    role: 'Superadmin',
  },
  {
    uid: 'tBz0lQ8DgNUMbgOERdKrt4cY5Gg1',
    email: 'admin@demo.com',
    name: 'Demo Admin',
    role: 'Admin',
    assignedZone: 'Zone A',
  },
  {
    uid: '546cY1n3x2Q7JPe948ELxA5mSrg1',
    email: 'worker@demo.com',
    name: 'Demo Worker',
    role: 'Worker',
    assignedZone: 'Zone A',
  },
  {
    uid: 'MCwBkI8jiKhsvXOFJMbnF2r8T3K3',
    email: 'citizen@demo.com',
    name: 'Demo Citizen',
    role: 'Citizen',
    rewardPoints: 50,
  },
  {
    uid: 'TKpAvBaQlFYTuEK2gwygWqXutig1',
    email: 'champion@demo.com',
    name: 'Demo Champion',
    role: 'Green-Champion',
    rewardPoints: 200,
  },
];

// Demo complaints with lat/lng for heatmap demo
const demoComplaints = [
  { title: 'Garbage overflow', category: 'Waste Management', location: 'Andheri West, Mumbai', lat: 19.1136, lng: 72.8697, status: 'SUBMITTED' },
  { title: 'Broken streetlight', category: 'Street Lighting', location: 'Bandra East, Mumbai', lat: 19.0596, lng: 72.8295, status: 'ASSIGNED' },
  { title: 'Road pothole', category: 'Road Damage', location: 'Powai, Mumbai', lat: 19.1176, lng: 72.9060, status: 'RESOLVED' },
  { title: 'Drainage blocked', category: 'Drainage/Sewage', location: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167, status: 'SUBMITTED' },
  { title: 'Open manhole', category: 'Drainage/Sewage', location: 'South Extension, Delhi', lat: 28.5706, lng: 77.2152, status: 'UNDER_REVIEW' },
  { title: 'Waste dumping', category: 'Waste Management', location: 'MG Road, Bangalore', lat: 12.9750, lng: 77.6081, status: 'ASSIGNED' },
  { title: 'Broken footpath', category: 'Public Property Damage', location: 'Whitefield, Bangalore', lat: 12.9698, lng: 77.7500, status: 'RESOLVED' },
  { title: 'Water pipe leak', category: 'Water Supply', location: 'T. Nagar, Chennai', lat: 13.0418, lng: 80.2341, status: 'SUBMITTED' },
  { title: 'Noise from factory', category: 'Noise Pollution', location: 'Park Street, Kolkata', lat: 22.5553, lng: 88.3512, status: 'RESOLVED' },
  { title: 'Garbage on road', category: 'Waste Management', location: 'Koregaon Park, Pune', lat: 18.5362, lng: 73.8942, status: 'SUBMITTED' },
];

// Demo citizen UID (citizen@demo.com)
const DEMO_CITIZEN_UID = 'MCwBkI8jiKhsvXOFJMbnF2r8T3K3';

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

  console.log('\nSeeding demo complaints...');
  for (const complaint of demoComplaints) {
    await db.collection('complaints').add({
      ...complaint,
      citizenId: DEMO_CITIZEN_UID,
      description: `Demo complaint: ${complaint.title} reported at ${complaint.location}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  console.log('Done seeding complaints.');

  console.log('\n✅ Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});