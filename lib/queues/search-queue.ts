import { Queue } from 'bullmq';

import { redisConnection } from '@/lib/redis';
import { SearchQueueInterface } from '@/types/search-queue';

import { defaultQueueConfig } from './config';

export const searchQueueName = 'recommendations';

export const searchQueue = new Queue<SearchQueueInterface>(searchQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig
});
