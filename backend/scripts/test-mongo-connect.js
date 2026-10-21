import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const rawUri = process.env.MONGODB_URI;

if (!rawUri) {
  console.error('MONGODB_URI is not set in backend/.env');
  process.exit(1);
}

// Masked display
const maskedUri = rawUri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/gi, '$1****$3');
console.log('Connecting with URI (credentials masked):', maskedUri);

async function test() {
  try {
    await mongoose.connect(rawUri, {
      dbName: 'medikiosk',
      serverSelectionTimeoutMS: 8000,
    });
    console.log('✓ Successfully connected to MongoDB Atlas!');
    console.log('Connection readyState:', mongoose.connection.readyState);
    await mongoose.disconnect();
  } catch (err) {
    console.error('✗ Connection failed:');
    console.error('  Error name:', err.name);
    console.error('  Error message:', err.message ? err.message.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/gi, '$1****$3') : err);
    if (err.reason) {
      console.error('  Driver reason:', JSON.stringify(err.reason, null, 2));
    }
  }
}

test();
