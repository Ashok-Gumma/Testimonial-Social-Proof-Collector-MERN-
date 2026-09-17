import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorMiddleware';

import authRoutes from './routes/authRoutes';
import spaceRoutes from './routes/spaceRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

const app = express();

// Trust reverse proxies (Render, Vercel, Cloudflare, etc.)
app.set('trust proxy', 1);

// Disable x-powered-by header for security
app.disable('x-powered-by');

// Middleware configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, iframes, embed scripts)
      if (
        !origin ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin === env.CLIENT_URL ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Allow embedded iframe widgets from any origin
      }
    },
    credentials: true,
  })
);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static uploads safely with nosniff header
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  })
);


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Testimonial & Social Proof Collector API',
  });
});

// Centralized error handler
app.use(errorHandler);

// Connect to DB first, then start server
const startServer = async () => {
  await connectDB();

  const PORT = parseInt(env.PORT, 10);
  app.listen(PORT, () => {
    console.log(`🚀 ProofPulse Server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check available at http://localhost:${PORT}/api/health`);
  });
};

startServer();

export default app;
