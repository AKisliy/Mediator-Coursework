import { Queue } from 'bullmq';

import { redisConnection } from '@/lib/redis';
import { SearchQueueInterface } from '@/types/search-queue';

import { defaultQueueConfig } from './config';

export const searchQueueName = 'recommendations';

export const searchQueue = new Queue<SearchQueueInterface>(searchQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig
});

// export const searchWorker = new Worker<SearchQueueInterface, SearchResponse>(
//   searchQueueName,
//   async job => processSearchTask(job),
//   { connection: redisConnection }
// );

// searchWorker.on('completed', async (job: Job, result: any) => {
//   await redisConnection.set(
//     `recommendation:${job.id}`,
//     JSON.stringify(result),
//     'EX',
//     600
//   );
// });

// searchWorker.on(
//   'failed',
//   async (
//     job: Job<SearchQueueInterface, SearchResponse, string> | undefined,
//     err: Error
//   ) => {
//     console.error(`Задача ${job?.id} завершилась ошибкой: ${err.message}`);
//     await redisConnection.set(
//       `recommendation:${job?.id}`,
//       JSON.stringify({ error: err.message }),
//       'EX',
//       120
//     );
//   }
// );
