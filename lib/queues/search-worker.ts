import { Job, Worker } from 'bullmq';

import { processSearchTask } from '@/app/actions/search.action';
import { redisConnection } from '@/lib/redis';
import { SearchResponse } from '@/models/response/search-response';
import { SearchQueueInterface } from '@/types/search-queue';

import { searchQueueName } from './search-queue';

export const searchWorker = new Worker<SearchQueueInterface, SearchResponse>(
  searchQueueName,
  async job => processSearchTask(job),
  { connection: redisConnection }
);

searchWorker.on('completed', async (job: Job, result: any) => {
  await redisConnection.set(
    `recommendation:${job.id}`,
    JSON.stringify(result),
    'EX',
    600
  );
});

searchWorker.on(
  'failed',
  async (
    job: Job<SearchQueueInterface, SearchResponse, string> | undefined,
    err: Error
  ) => {
    console.error(`Задача ${job?.id} завершилась ошибкой: ${err.message}`);
    await redisConnection.set(
      `recommendation:${job?.id}`,
      JSON.stringify({ error: err.message }),
      'EX',
      120
    );
  }
);
