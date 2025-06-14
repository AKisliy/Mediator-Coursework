'use server';

import { Job } from 'bullmq';
import { getTranslations } from 'next-intl/server';

import { setContextUserId } from '@/lib/auth-context';
import { getContextUserId, withAuth } from '@/lib/auth-wrapper';
import { generateMockBloggers } from '@/lib/mock/bloggers';
import { searchQueue } from '@/lib/queues/search-queue';
import { enrichQueryWithFilters } from '@/lib/utils';
import { transformRecommendations } from '@/models/blogger-mappings';
import {
  SearchResponse,
  SearchResponseDTO
} from '@/models/response/search-response';
import { FilterValue } from '@/types/search-filters';
import { SearchQueueInterface } from '@/types/search-queue';

import { addSearchToHistoryAction } from './data/history';

async function startSearchTaskAction(
  query: string,
  filters: FilterValue[],
  k: number
): Promise<{ jobId: string | undefined }> {
  const t = await getTranslations('auth.errors');
  const userId = getContextUserId();
  if (!userId) {
    throw new Error(t('notAuthorized'));
  }
  const job = await searchQueue.add('process-recommendation', {
    user_id: userId,
    filters,
    query,
    k
  });

  return { jobId: job.id };
}

export async function processSearchTask(
  job: Job<SearchQueueInterface, SearchResponse, string>
) {
  console.log(`Обработка задачи ${job.id}...`);
  console.log('IN SERVER ACTION');
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
      console.log(`Задача ${job.id} обработана успешно (mock)`);
      // await addSearchToHistory(result.uuid, query, result.recommendations);
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

    console.log('Got response');

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res = (await response.json()) as SearchResponseDTO;
    console.log('Got response from server:', res);
    const parsedBloggers = transformRecommendations(res.recommendations);

    setContextUserId(user_id);
    await addSearchToHistoryAction(res.uuid, query, parsedBloggers);
    console.log(`Задача ${job.id} обработана успешно`);
    console.log('Parsed bloggers:', parsedBloggers);
    return { uuid: res.uuid, recommendations: parsedBloggers };
  } catch (e: any) {
    console.error(`Ошибка при обработке задачи ${job.id}: ${e.message}`);
    throw e;
  }
}

export const startSearchTask = withAuth(startSearchTaskAction);
