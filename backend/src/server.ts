import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB, isDbConnected, getDbStatusText } from './config/db.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

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
  });
}

startServer();
