import mongoose from 'mongoose';

let reconnectTimer: NodeJS.Timeout | null = null;

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

  // Handle connection events gracefully
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ [MediKiosk DB] MongoDB disconnected. Scheduling reconnect attempt...');
    scheduleReconnect();
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 [MediKiosk DB] MongoDB reconnected.');
    if (reconnectTimer) {
      clearInterval(reconnectTimer);
      reconnectTimer = null;
    }
  });

  await attemptConnection();
}

async function attemptConnection(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) return false;

  try {
    // Connect to MongoDB Atlas using database name 'medikiosk'
    await mongoose.connect(mongoUri, {
      dbName: 'medikiosk',
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ [MediKiosk DB] Successfully connected to MongoDB Atlas database: "medikiosk"');
    if (reconnectTimer) {
      clearInterval(reconnectTimer);
      reconnectTimer = null;
    }
    return true;
  } catch (error) {
    console.error('❌ [MediKiosk DB] Connection failed.');
    if (error instanceof Error) {
      // Categorize error cleanly without exposing secrets
      const msg = error.message;
      if (msg.includes('whitelisted') || msg.includes('ssl alert') || msg.includes('SSL routines') || msg.includes('ReplicaSetNoPrimary')) {
        console.error('   Category: [Atlas Network Access / IP Whitelist]');
        console.error('   Action: Whitelist your current public IP in MongoDB Atlas Security -> Network Access.');
      } else if (msg.includes('AuthenticationFailed') || msg.includes('auth failed') || (error as any).code === 18) {
        console.error('   Category: [Authentication Error]');
        console.error('   Action: Verify database username and password in backend/.env MONGODB_URI.');
      } else if (msg.includes('ENOTFOUND') || msg.includes('querySrv')) {
        console.error('   Category: [DNS Resolution Error]');
        console.error('   Action: Cluster hostname could not be resolved. Check internet and cluster address.');
      } else {
        const sanitized = msg.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/gi, '$1****$3');
        console.error(`   Error details: ${sanitized}`);
      }
    } else {
      console.error('   An unexpected database error occurred.');
    }

    scheduleReconnect();
    return false;
  }
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setInterval(async () => {
    if (isDbConnected()) {
      if (reconnectTimer) {
        clearInterval(reconnectTimer);
        reconnectTimer = null;
      }
      return;
    }
    console.log('🔄 [MediKiosk DB] Retrying Atlas database connection...');
    await attemptConnection();
  }, 10000); // Retry every 10 seconds
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

let activeConnectPromise: Promise<boolean> | null = null;

/**
 * Ensures MongoDB Atlas is connected before handling an incoming request.
 * In serverless environments (e.g. Vercel Functions), reuses an existing warm connection
 * or completes connection during cold start.
 */
export async function ensureDbConnected(): Promise<boolean> {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  if (!process.env.MONGODB_URI) {
    return false;
  }
  if (activeConnectPromise) {
    return activeConnectPromise;
  }
  activeConnectPromise = attemptConnection().finally(() => {
    activeConnectPromise = null;
  });
  return activeConnectPromise;
}
