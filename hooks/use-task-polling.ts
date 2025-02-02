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
      const response = await fetch(`/api/task/${taskId}`);
      if (response.status !== 202) {
        try {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
          }
          const responseData = await response.json();
          setData(responseData);
          onSuccess?.(responseData);
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
