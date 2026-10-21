import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB, isDbConnected, getDbStatusText } from './config/db.js';
import patientRoutes from './routes/patientRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing middleware
app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // fallback allow for local dev
      }
    },
    credentials: true,
  })
);

// Enforce sensible payload size limits (1mb is plenty for text clinical intake)
app.use(express.json({ limit: '1mb' }));

// Initial Health-Check Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
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
});

// Mount Patient Intake Routes
app.use('/api/patients', patientRoutes);

// Root Information Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'MediKiosk Clinical Intake Backend Service',
    healthCheck: '/api/health',
    status: 'online',
  });
});

// Connect to MongoDB Atlas and start server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🏥 [MediKiosk API] Server listening on http://127.0.0.1:${PORT}`);
    console.log(`🩺 [MediKiosk API] Health check endpoint: http://127.0.0.1:${PORT}/api/health`);
    console.log(`📋 [MediKiosk API] Intake endpoint: POST http://127.0.0.1:${PORT}/api/patients/intake`);
  });
}

startServer();
