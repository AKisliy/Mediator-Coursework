'use server';

import { getContextUserId, withAuth } from '@/lib/auth-wrapper';
import { processSearchQueue } from '@/lib/queues/processSearchQueue';
import { FilterValue } from '@/types/search-filters';

async function startSearchTaskAction(
  query: string,
  filters: FilterValue[],
  k: number
): Promise<{ jobId: string | undefined }> {
  const userId = getContextUserId();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const job = await processSearchQueue.add('process-recommendation', {
    user_id: userId,
    filters,
    query,
    k
  });

  return { jobId: job.id };
}

export const startSearchTask = withAuth(startSearchTaskAction);
