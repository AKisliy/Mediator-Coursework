import { Job, Queue, Worker } from 'bullmq';

import { addSearchToHistory } from '@/app/actions/data/history';
import { redisConnection } from '@/lib/redis';
import { transformRecommendations } from '@/models/blogger-mappings';
import {
  SearchResponse,
  SearchResponseDTO
} from '@/models/response/search-response';
import { FilterValue } from '@/types/search-filters';

import { generateMockBloggers } from '../mock/bloggers';
import { enrichQueryWithFilters } from '../utils';
import { defaultQueueConfig } from './config';

const queueName = 'recommendations';

interface QueueInterface {
  query: string;
  k: number;
  user_id: string;
  filters: FilterValue[];
}

export const processSearchQueue = new Queue<QueueInterface>(queueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig
});

export const searchWorker = new Worker<QueueInterface, SearchResponse>(
  queueName,
  async job => {
    console.log(`Обрабатываем задачу ${job.id}`);
    const { query, k, filters, user_id } = job.data;
    const url = `${process.env.SERVER_API}/search`;

    try {
      if (process.env.USE_MOCK_API === 'true') {
        const response = generateMockBloggers(query, k);
        const bloggers = transformRecommendations(response.recommendations);
        const result: SearchResponse = {
          uuid: response.uuid,
          recommendations: bloggers
        };
        await addSearchToHistory(result.uuid, query, result.recommendations);
        return result;
      }

      const body = {
        user_id,
        k,
        query: enrichQueryWithFilters(query, filters)
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const res = (await response.json()) as SearchResponseDTO;
      const parsedBloggers = transformRecommendations(res.recommendations);
      await addSearchToHistory(res.uuid, query, parsedBloggers);

      return { uuid: res.uuid, recommendations: parsedBloggers };
    } catch (e: any) {
      console.error(`Ошибка при обработке задачи ${job.id}: ${e.message}`);
      throw e;
    }
  },
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
    job: Job<QueueInterface, SearchResponse, string> | undefined,
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
