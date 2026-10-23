import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB, ensureDbConnected, isDbConnected, getDbStatusText, getLastDbError } from './config/db.js';
import patientRoutes from './routes/patientRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from cwd, backend/.env, or parent paths
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

// Security & Parsing middleware (robust across ESM and CJS Node runtimes)
const helmetMiddleware = typeof helmet === 'function' ? helmet : ((helmet as any).default || helmet);
app.use((helmetMiddleware as any)());

// Build allowed origins list: strictly restricted to intended frontend deployments
const defaultLocalOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

// Specific known MediKiosk frontend deployment domains
const knownMediKioskOrigins = [
  'https://medikiosk-frontend-iota.vercel.app',
  'https://medikiosk-frontend.vercel.app',
];

const configuredOrigins: string[] = [...knownMediKioskOrigins];
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach((url) => {
    const trimmed = url.trim().replace(/\/+$/, '');
    if (trimmed && !configuredOrigins.includes(trimmed)) {
      configuredOrigins.push(trimmed);
    }
  });
}

const isOriginAllowed = (origin: string): boolean => {
  // 1. Explicitly configured origins (from FRONTEND_URL & known MediKiosk domains)
  if (configuredOrigins.includes(origin)) return true;

  // 2. MediKiosk project-specific preview deployments strictly matching medikiosk-frontend-*
  if (/^https:\/\/medikiosk-frontend(?:-[a-z0-9]+)*\.vercel\.app$/i.test(origin)) {
    return true;
  }

  // 3. Local development origins (localhost / 127.0.0.1)
  if (defaultLocalOrigins.includes(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;

  // Reject all other origins (including other arbitrary *.vercel.app origins)
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      if (!isProduction) {
        return callback(null, true); // fallback for local dev
      }
      // Graceful rejection without throwing an unhandled Error (which causes 500 HTML pages)
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);

// Enforce sensible payload size limits (1mb is plenty for text clinical intake)
app.use(express.json({ limit: '1mb' }));

// Ensure database connection for all incoming requests (crucial for serverless cold-starts)
app.use(async (_req, _res, next) => {
  await ensureDbConnected();
  next();
});

// Health-Check Handler
const handleHealth = (_req: Request, res: Response) => {
  const dbConnected = isDbConnected();
  const dbStatus = getDbStatusText();
  const lastError = getLastDbError();

  res.status(200).json({
    status: 'ok',
    service: 'MediKiosk Clinical Intake Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      connected: dbConnected,
      name: 'medikiosk',
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      lastError: lastError || (dbConnected ? null : 'Awaiting initial connection or IP whitelist'),
    },
    environment: process.env.NODE_ENV || 'development',
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// Mount Patient Intake Routes
app.use('/api/patients', patientRoutes);
app.use('/patients', patientRoutes);

// Root Information Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'MediKiosk Clinical Intake Backend Service',
    healthCheck: '/api/health',
    status: 'online',
  });
});

// Central JSON error handler (prevents default Express HTML error responses)
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('Unhandled server error:', err);
  res.status(err?.status || 500).json({
    success: false,
    error: err?.message || 'Internal Server Error',
  });
});

// Connect to MongoDB Atlas and start standalone server (when not running in serverless)
async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`🏥 [MediKiosk API] Server listening on http://127.0.0.1:${PORT}`);
    console.log(`🩺 [MediKiosk API] Health check endpoint: http://127.0.0.1:${PORT}/api/health`);
    console.log(`📋 [MediKiosk API] Intake endpoint: POST http://127.0.0.1:${PORT}/api/patients/intake`);
  });

  // Attempt DB connection in background without blocking server startup
  connectDB().catch((err) => {
    console.warn('⚠️ [MediKiosk API] Initial DB connection warning:', err instanceof Error ? err.message : err);
  });

  return server;
}

// Only start listening on port if not running in a Vercel serverless environment
if (process.env.VERCEL !== '1' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer();
}

export default app;
export { app };
