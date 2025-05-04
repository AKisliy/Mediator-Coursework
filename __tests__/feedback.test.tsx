/**
 * @jest-environment node
 */
import { sendFeedback } from '@/app/actions/feedback.action';
import { auth } from '@/auth';

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('@/lib/mock/config', () => ({
  MOCK_USERNAME: 'test-user'
}));

jest.mock('@/auth', () => ({
  auth: jest.fn()
}));

describe('sendFeedback', () => {
  const mockRequestId = '12345';
  const mockScore = 5;
  const mockServerApi = 'https://api.example.com';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeAll(() => {
    process.env.SERVER_API = mockServerApi;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    (auth as jest.Mock).mockImplementation(async () => ({
      user: {
        id: 'mock-user-id',
        name: 'Mock User',
        email: 'mock@example.com'
      },
      expires: new Date().toISOString()
    }));
  });

  afterAll(() => {
    delete process.env.SERVER_API;
  });

  it('should send feedback successfully and return data', async () => {
    const mockResponseData = { success: true, feedbackId: 'abc123' };
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue(mockResponseData)
    });

    const result = await sendFeedback(mockRequestId, mockScore);

    expect(mockFetch).toHaveBeenCalledWith(`${mockServerApi}/feedback`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid: mockRequestId,
        score: mockScore,
        username: 'test-user'
      })
    });
    expect(result).toEqual(mockResponseData);
  });

  it('should throw an error if the response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: jest.fn().mockResolvedValue({})
    });

    await expect(sendFeedback(mockRequestId, mockScore)).rejects.toThrow(
      'Ошибка отправки фидбека: Bad Request'
    );

    expect(mockFetch).toHaveBeenCalledWith(`${mockServerApi}/feedback`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid: mockRequestId,
        score: mockScore,
        username: 'test-user'
      })
    });
  });

  it('should throw an error if response is undefined', async () => {
    mockFetch.mockResolvedValue(undefined);

    await expect(sendFeedback(mockRequestId, mockScore)).rejects.toThrow(
      'Ошибка отправки фидбека: undefined'
    );
  });

  it('should handle invalid requestId', async () => {
    const invalidRequestId = '';
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: jest.fn().mockResolvedValue({})
    });

    await expect(sendFeedback(invalidRequestId, mockScore)).rejects.toThrow(
      'Ошибка отправки фидбека: Bad Request'
    );

    expect(mockFetch).toHaveBeenCalledWith(`${mockServerApi}/feedback`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid: invalidRequestId,
        score: mockScore,
        username: 'test-user'
      })
    });
  });

  it('should handle invalid score', async () => {
    const invalidScore = -1;
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: jest.fn().mockResolvedValue({})
    });

    await expect(sendFeedback(mockRequestId, invalidScore)).rejects.toThrow(
      'Ошибка отправки фидбека: Bad Request'
    );

    expect(mockFetch).toHaveBeenCalledWith(`${mockServerApi}/feedback`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid: mockRequestId,
        score: invalidScore,
        username: 'test-user'
      })
    });
  });
});
