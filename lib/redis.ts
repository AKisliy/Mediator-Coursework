import Redis from 'ioredis';

export const redisConnection = new Redis({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy(times) {
    const delay = Math.min(times * 500, 3000);
    if (times > 10) {
      return undefined;
    }
    return delay;
  },
  connectTimeout: 10000,
  reconnectOnError(err) {
    const targetErrors = ['READONLY', 'ECONNRESET', 'ECONNREFUSED'];
    return targetErrors.some(error => err.message.includes(error));
  }
});
