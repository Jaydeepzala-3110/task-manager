import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import { logger } from './utils/logger';
import app from './app';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URL || '')
  .then(async () => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('Error connecting to MongoDB: ', err);
  });

server.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
});

