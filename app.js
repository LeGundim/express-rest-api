import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import { initializeDatabase } from './initDb.js';
import dotenv from 'dotenv';


// Only load environment variables if .env file exists and not in production or CI environment
if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  dotenv.config();
}

// Initialize Express app
const app = express();

// Define port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images')); // Serve uploaded images

// Routes
app.use('/users', userRoutes);
app.use('/user', eventRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  initializeDatabase();
});