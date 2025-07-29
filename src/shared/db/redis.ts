import { createClient } from 'redis';
import { env } from '../../config/env.js';

const url = `redis://:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`;

export const redisClient = createClient({
  url: url,
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    throw new Error('Failed to connect to Redis');
  }
};
