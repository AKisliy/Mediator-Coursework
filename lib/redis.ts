import Redis from 'ioredis';

export const redisConnection = new Redis({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});
