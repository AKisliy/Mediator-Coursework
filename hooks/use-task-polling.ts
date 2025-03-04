import { getTaskStatus } from '@/app/actions/task.action';
import { useEffect, useState } from 'react';

interface UseTaskPollingProps<T> {
  taskId: string | null;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
  interval?: number;
}

export function useTaskPolling<T>({
  taskId,
  onSuccess,
  onError,
  onComplete,
  interval = 3000
}: UseTaskPollingProps<T>) {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    setIsPolling(true);

    const pollInterval = setInterval(async () => {
      const response = await getTaskStatus<T>(taskId);
      if (response.status !== 'pending') {
        try {
          if (response.status === 'error') {
            throw new Error('Task failed');
          }
          if (response.data === null) {
            throw new Error('Task data is empty');
          }
          setData(response.data);
          onSuccess?.(response.data);
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Unknown error occurred';
          setError(errorMessage);
          onError?.(errorMessage);
        } finally {
          clearInterval(pollInterval);
          setIsPolling(false);
          onComplete?.();
        }
      }
    }, interval);

    return () => clearInterval(pollInterval);
  }, [taskId, onSuccess, onError, onComplete, interval]);

  return { error, data, isPolling };
}
