import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import feedbackRoutes from './routes/feedback.routes';
import authRoutes     from './routes/auth.routes';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 4000;

const limiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { success: false, error: 'Too many requests.' } });

app.use(cors());
app.use(express.json());
app.use('/api/feedback', limiter); // rate-limit submissions

app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth',     authRoutes);

app.get('/', (_req, res) => res.json({ success: true, message: 'FeedPulse API is running' }));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('Failed to connect:', error);
    process.exit(1);
  }
};

startServer();