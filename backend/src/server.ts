// backend/src/server.ts
import 'dotenv/config'; // Load environment variables first
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); 
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { initializeDatabase } from './utils/db';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://your-heirloom-frontend.com' : 'http://localhost:3000', // Allow your Next.js frontend
  credentials: true, // If you plan to send cookies/auth headers
}));
app.use(express.json()); // Body parser for JSON requests

// Routes
app.use('/api/auth', authRoutes);

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Heirloom Backend is running!' });
});

// Start server and initialize DB
const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access backend at http://localhost:${PORT}`);
  });
};

startServer();