'use server';

import { redisConnection } from '@/lib/redis';

type TaskStatus = {
  status: 'pending' | 'error' | 'success';
};

export async function getTaskStatus<T>(
  jobId: string
): Promise<TaskStatus & { data: T | null }> {
  const result = await redisConnection.get(`recommendation:${jobId}`);

  if (result) {
    const data = JSON.parse(result);
    if (data.error) {
      return { status: 'error', data: data.error };
    }
    return { status: 'success', data };
  }

  return { status: 'pending', data: null };
}
