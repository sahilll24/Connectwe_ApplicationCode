import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/database';
import { mockDb } from './mockDb';

// Import routes
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import adminRoutes from './routes/admin';
import userRoutes from './routes/user';

// Load env vars
dotenv.config();

// Connect to database (or use mock DB)
const useMockDb = process.env.USE_MOCK_DB === 'true';

if (useMockDb) {
  console.log('Using in-memory mock database for demonstration');
  mockDb.initializeData();
} else {
  connectDB().catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    console.log('Falling back to in-memory mock database');
    mockDb.initializeData();
  });
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
