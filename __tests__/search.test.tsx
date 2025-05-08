/**
 * @jest-environment node
 */
import { startSearchTask } from '@/app/actions/search.action';
import { getCurrentUserId } from '@/app/api/auth/utils';
import { auth } from '@/auth';
import { getContextUserId } from '@/lib/auth-wrapper';
import { processSearchQueue } from '@/lib/queues/processSearchQueue';
import { FilterValue } from '@/types/search-filters';

jest.mock('@/app/api/auth/utils', () => ({
  getCurrentUserId: jest.fn()
}));

jest.mock('@/lib/queues/processSearchQueue', () => ({
  processSearchQueue: {
    add: jest.fn()
  }
}));

jest.mock('@/auth', () => ({
  auth: jest.fn()
}));

jest.mock('@/lib/auth-wrapper', () => ({
  withAuth: jest.fn(fn => fn),
  getContextUserId: jest.fn()
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
  const mockUserName = 'test-user';
  const mockUserEmail = 'some-email@my.com';
  const mockJobId = '4165a350-e657-4e70-a9e5-1fec6ee29a58';

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockImplementation(async () => ({
      user: {
        id: mockUserId,
        name: mockUserName,
        email: mockUserEmail
      },
      expires: new Date().toISOString()
    }));
    (getContextUserId as jest.Mock).mockReturnValue(mockUserId);
    (getCurrentUserId as jest.Mock).mockReturnValue(mockUserId);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a search task and return jobId for authenticated user', async () => {
    (processSearchQueue.add as jest.Mock).mockResolvedValue({ id: mockJobId });
    const result = await startSearchTask(mockQuery, mockFilters, mockK);

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

  it('should handle error from processSearchQueue.add', async () => {
    (processSearchQueue.add as jest.Mock).mockRejectedValue(
      new Error('Queue error')
    );

    await expect(
      startSearchTask(mockQuery, mockFilters, mockK)
    ).rejects.toThrow('Queue error');

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
    (processSearchQueue.add as jest.Mock).mockResolvedValue({ id: mockJobId });

    const result = await startSearchTask('', mockFilters, mockK);

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
    (processSearchQueue.add as jest.Mock).mockResolvedValue({ id: mockJobId });

    const result = await startSearchTask(mockQuery, [], mockK);

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
    (processSearchQueue.add as jest.Mock).mockResolvedValue({ id: mockJobId });

    const result = await startSearchTask(mockQuery, mockFilters, -1);

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
