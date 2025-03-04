'use server';

import { processSearchQueue } from '@/lib/queues/processSearchQueue';
import { verifySessionAndGetId } from '../api/auth/utils';

export async function startSearchTask(
  query: string,
  k: number
): Promise<{ jobId: string | undefined }> {
  const userId = await verifySessionAndGetId();
  const job = await processSearchQueue.add('process-recommendation', {
    user_id: userId,
    query,
    k
  });

  return { jobId: job.id };
}
