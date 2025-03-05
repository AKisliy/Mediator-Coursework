'use server';

import { processSearchQueue } from '@/lib/queues/processSearchQueue';
import { FilterValue } from '@/types/search-filters';
import { verifySessionAndGetId } from '../api/auth/utils';

export async function startSearchTask(
  query: string,
  filters: FilterValue[],
  k: number
): Promise<{ jobId: string | undefined }> {
  const userId = await verifySessionAndGetId();
  const job = await processSearchQueue.add('process-recommendation', {
    user_id: userId,
    filters,
    query,
    k
  });

  return { jobId: job.id };
}
