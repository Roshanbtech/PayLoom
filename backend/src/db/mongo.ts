import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../core/logger';

export async function connectMongo() {
  await mongoose.connect(env.MONGO_URI);
  logger.info('MongoDB connected');
}
