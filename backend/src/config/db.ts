import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas securely.
 * Credentials and URI are strictly retrieved from environment variables.
 * Connection strings and credentials are never logged to console or exposed.
 */
export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn(
      '⚠️ [MediKiosk DB] MONGODB_URI environment variable is not defined. Database connection skipped (operating in disconnected sandbox mode).'
    );
    return;
  }

  try {
    // Connect to MongoDB Atlas using database name 'medikiosk'
    await mongoose.connect(mongoUri, {
      dbName: 'medikiosk',
      serverSelectionTimeoutMS: 5000, // Quick timeout if host unreachable
    });

    console.log('✅ [MediKiosk DB] Successfully connected to MongoDB Atlas database: "medikiosk"');
  } catch (error) {
    console.error('❌ [MediKiosk DB] Connection failed:');
    if (error instanceof Error) {
      console.error(`   Error message: ${error.message}`);
    } else {
      console.error('   An unexpected database error occurred.');
    }
  }

  // Handle connection events gracefully
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ [MediKiosk DB] MongoDB disconnected.');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 [MediKiosk DB] MongoDB reconnected.');
  });
}

/**
 * Health check helper to verify database connection status.
 * Returns true if mongoose connection state is 1 (connected).
 */
export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Returns human-readable connection status string.
 */
export function getDbStatusText(): 'connected' | 'connecting' | 'disconnecting' | 'disconnected' {
  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
}
