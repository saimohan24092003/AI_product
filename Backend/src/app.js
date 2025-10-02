// app.js

// Core dependencies
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

// Config and utilities
import { env } from './config/env.js';
import { httpLogger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectToDatabase } from './config/database.js';

// Import OAuth configuration
import './config/passport.js';

// Import routers
import chatRouter from './routes/chat.js';
import authRouter from './routes/auth.js';
import strategyRouter from './routes/strategy.js';
import contentRouter from './routes/content.js';
import feedbackRouter from './routes/feedback.js';
import notificationsRouter from './routes/notifications.js';
import smeRouter from './routes/sme.js';
import legacyEndpointsRouter from './routes/legacy-endpoints.js';
import analyticsRouter from './routes/analytics.js';
import commentsRouter from './routes/comments.js';

// Create Express app
const app = express(); // ✅ Must be first

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(helmet());
app.use(cors({
  origin: [
    env.frontendOrigin,
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(httpLogger);

// Session + Passport
app.use(session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: env.nodeEnv === 'production', httpOnly: true, maxAge: 24*60*60*1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// Rate limiter
const globalLimiter = rateLimit({ windowMs: 60*1000, max: 120 });
app.use(globalLimiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/strategy', strategyRouter);
app.use('/api/content', contentRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/sme', smeRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api', legacyEndpointsRouter);

// Healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use(errorHandler);

// Connect to MongoDB
connectToDatabase().catch(error => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

// Export app for Vercel
export default app;
