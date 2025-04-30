/**
 * @jest-environment node
 */
import { startSearchTask } from '@/app/actions/search.action';
import { verifySessionAndGetId } from '@/app/api/auth/utils';
import { processSearchQueue } from '@/lib/queues/processSearchQueue';
import { FilterValue } from '@/types/search-filters';

jest.mock('@/app/api/auth/utils', () => ({
  verifySessionAndGetId: jest.fn()
}));

jest.mock('@/lib/queues/processSearchQueue', () => ({
  processSearchQueue: {
    add: jest.fn()
  }
}));

describe('startSearchTask', () => {
  const mockQuery = 'test query';
  const mockFilters: FilterValue[] = [
    { id: 'followers', name: 'Followers', min: 0, max: 10, value: [1, 2] },
    {
      id: 'avg_views',
      name: 'Average views',
      min: 0,
      max: 1000,
      value: [10, 900]
    }
  ];
  const mockK = 10;
  const mockUserId = '11123';
  const mockJobId = '4165a350-e657-4e70-a9e5-1fec6ee29a58';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a search task and return jobId for authenticated user', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (processSearchQueue.add as jest.Mock).mockResolvedValue({ id: mockJobId });

    const result = await startSearchTask(mockQuery, mockFilters, mockK);

    expect(verifySessionAndGetId).toHaveBeenCalled();
    expect(processSearchQueue.add).toHaveBeenCalledWith(
      'process-recommendation',
      {
        user_id: mockUserId,
        filters: mockFilters,
        query: mockQuery,
        k: mockK
      }
    );
    expect(result).toEqual({ jobId: mockJobId });
  });

  it('should throw exception if user is not authenticated', async () => {
    (verifySessionAndGetId as jest.Mock).mockImplementation(() => {
      throw new Error('Пользователь не авторизован');
    });

    await expect(
      startSearchTask(mockQuery, mockFilters, mockK)
    ).rejects.toThrow('Пользователь не авторизован');

    expect(verifySessionAndGetId).toHaveBeenCalled();
    expect(processSearchQueue.add).not.toHaveBeenCalled();
  });

  it('should handle error from verifySessionAndGetId', async () => {
    (verifySessionAndGetId as jest.Mock).mockRejectedValue(
      new Error('Session error')
    );

    await expect(
      startSearchTask(mockQuery, mockFilters, mockK)
    ).rejects.toThrow('Session error');

    expect(verifySessionAndGetId).toHaveBeenCalled();
    expect(processSearchQueue.add).not.toHaveBeenCalled();
  });

  it('should handle error from processSearchQueue.add', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (processSearchQueue.add as jest.Mock).mockRejectedValue(
      new Error('Queue error')
    );

    await expect(
      startSearchTask(mockQuery, mockFilters, mockK)
    ).rejects.toThrow('Queue error');

    expect(verifySessionAndGetId).toHaveBeenCalled();
    expect(processSearchQueue.add).toHaveBeenCalledWith(
      'process-recommendation',
      {
        user_id: mockUserId,
        filters: mockFilters,
        query: mockQuery,
        k: mockK
      }
    );
  });

  it('should handle empty query', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (processSearchQueue.add as jest.Mock).mockResolvedValue({ id: mockJobId });

    const result = await startSearchTask('', mockFilters, mockK);

    expect(verifySessionAndGetId).toHaveBeenCalled();
    expect(processSearchQueue.add).toHaveBeenCalledWith(
      'process-recommendation',
      {
        user_id: mockUserId,
        filters: mockFilters,
        query: '',
        k: mockK
      }
    );
    expect(result).toEqual({ jobId: mockJobId });
  });

  it('should handle empty filters array', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (processSearchQueue.add as jest.Mock).mockResolvedValue({ id: mockJobId });

    const result = await startSearchTask(mockQuery, [], mockK);

    expect(verifySessionAndGetId).toHaveBeenCalled();
    expect(processSearchQueue.add).toHaveBeenCalledWith(
      'process-recommendation',
      {
        user_id: mockUserId,
        filters: [],
        query: mockQuery,
        k: mockK
      }
    );
    expect(result).toEqual({ jobId: mockJobId });
  });

  it('should handle negative k', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (processSearchQueue.add as jest.Mock).mockResolvedValue({ id: mockJobId });

    const result = await startSearchTask(mockQuery, mockFilters, -1);

    expect(verifySessionAndGetId).toHaveBeenCalled();
    expect(processSearchQueue.add).toHaveBeenCalledWith(
      'process-recommendation',
      {
        user_id: mockUserId,
        filters: mockFilters,
        query: mockQuery,
        k: -1
      }
    );
    expect(result).toEqual({ jobId: mockJobId });
  });
});
