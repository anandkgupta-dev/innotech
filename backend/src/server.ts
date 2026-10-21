import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB, ensureDbConnected, isDbConnected, getDbStatusText } from './config/db.js';
import patientRoutes from './routes/patientRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

// Security & Parsing middleware (robust across ESM and CJS Node runtimes)
const helmetMiddleware = typeof helmet === 'function' ? helmet : ((helmet as any).default || helmet);
app.use((helmetMiddleware as any)());

// Build allowed origins list
const defaultLocalOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];

const configuredOrigins: string[] = [];
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach((url) => {
    const trimmed = url.trim().replace(/\/+$/, '');
    if (trimmed) configuredOrigins.push(trimmed);
  });
}

const allowedOrigins = isProduction
  ? configuredOrigins
  : [...defaultLocalOrigins, ...configuredOrigins];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (!isProduction) {
        return callback(null, true); // fallback for local dev
      }
      // Strict rejection in production
      return callback(new Error(`CORS blocked: Origin ${origin} not permitted.`));
    },
    credentials: true,
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

  res.status(200).json({
    status: 'ok',
    service: 'MediKiosk Clinical Intake Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      connected: dbConnected,
      name: 'medikiosk',
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

// Connect to MongoDB Atlas and start standalone server (when not running in serverless)
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🏥 [MediKiosk API] Server listening on http://127.0.0.1:${PORT}`);
    console.log(`🩺 [MediKiosk API] Health check endpoint: http://127.0.0.1:${PORT}/api/health`);
    console.log(`📋 [MediKiosk API] Intake endpoint: POST http://127.0.0.1:${PORT}/api/patients/intake`);
  });
}

// Only start listening on port if not running in a Vercel serverless environment
if (process.env.VERCEL !== '1' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer();
}

export default app;
export { app };
