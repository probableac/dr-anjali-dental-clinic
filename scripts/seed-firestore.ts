import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
  databaseId: process.env.VITE_FIREBASE_DATABASE_ID || '(default)'
};

async function seed() {
  console.log('----------------------------------------------------');
  console.log('🌿 Serene Dental Sanctuary - Firestore Database Seeder');
  console.log('----------------------------------------------------');

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Error: Missing Firebase credentials in .env file.');
    console.error('Please make sure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID are set.');
    process.exit(1);
  }

  console.log(`Connecting to external Firebase Project: ${firebaseConfig.projectId}...`);

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Read data/db.json
    const dbJsonPath = path.resolve(__dirname, '..', 'data', 'db.json');
    if (!fs.existsSync(dbJsonPath)) {
      console.error(`❌ data/db.json not found at ${dbJsonPath}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(dbJsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    // 1. Seed Consultations
    if (Array.isArray(data.consultations) && data.consultations.length > 0) {
      console.log(`\n⏳ Seeding ${data.consultations.length} consultations...`);
      for (const item of data.consultations) {
        await setDoc(doc(db, 'consultations', item.id), item);
        console.log(`  ✓ Added consultation: [${item.id}] ${item.patientName} (${item.date} ${item.timeSlot})`);
      }
    }

    // 2. Seed Reviews
    if (Array.isArray(data.reviews) && data.reviews.length > 0) {
      console.log(`\n⏳ Seeding ${data.reviews.length} patient reviews...`);
      for (const item of data.reviews) {
        await setDoc(doc(db, 'reviews', item.id), item);
        console.log(`  ✓ Added review: [${item.id}] from ${item.name} (${item.rating}★)`);
      }
    }

    // 3. Seed Services / Dynamic Pricing Catalog
    if (Array.isArray(data.services) && data.services.length > 0) {
      console.log(`\n⏳ Seeding ${data.services.length} dental services & pricing...`);
      for (const item of data.services) {
        await setDoc(doc(db, 'services', item.id), item);
        console.log(`  ✓ Added service: [${item.id}] ${item.name} - ₹${item.priceInINR?.toLocaleString('en-IN')}`);
      }
    }

    console.log('\n🎉 SUCCESS! External Firestore database seeded completely.');
    console.log('You can now verify the collections in your Firebase Console:');
    console.log(`👉 https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);
    console.log('----------------------------------------------------\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed with error:', error);
    process.exit(1);
  }
}

seed();
