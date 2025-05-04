/**
 * @jest-environment node
 */
import { getReason } from '@/app/actions/reason.action';
import { MOCK_REASON_TEXT } from '@/lib/mock/config';
import { getReasonMock } from '@/lib/mock/reason';

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('@/lib/mock/reason', () => ({
  getReasonMock: jest.fn()
}));

describe('getReason', () => {
  const mockId = '12345';
  const mockQuestion = 'Why did this blogger?';
  const mockServerApi = 'https://api.example.com';

  beforeAll(() => {
    process.env.SERVER_API = mockServerApi;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.SERVER_API;
    delete process.env.USE_MOCK_API;
  });

  it('should return mock data when USE_MOCK_API is true', async () => {
    process.env.USE_MOCK_API = 'true';
    const mockReason = { result: MOCK_REASON_TEXT };
    (getReasonMock as jest.Mock).mockReturnValue(mockReason);

    const result = await getReason(mockId, mockQuestion);

    expect(getReasonMock).toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
    expect(result).toEqual(mockReason);
  });

  it('should send request and return result when USE_MOCK_API is false', async () => {
    process.env.USE_MOCK_API = 'false';
    const mockResponseData = { result: 'Actual reason' };
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue(mockResponseData)
    });

    const result = await getReason(mockId, mockQuestion);

    expect(mockFetch).toHaveBeenCalledWith(`${mockServerApi}/reason`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: mockId,
        question: mockQuestion
      })
    });
    expect(getReasonMock).not.toHaveBeenCalled();
    expect(result).toEqual(mockResponseData.result);
  });

  it('should throw an error if the response is not ok', async () => {
    process.env.USE_MOCK_API = 'false';
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: jest.fn().mockResolvedValue({})
    });

    await expect(getReason(mockId, mockQuestion)).rejects.toThrow(
      'Bad Request'
    );

    expect(mockFetch).toHaveBeenCalledWith(`${mockServerApi}/reason`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: mockId,
        question: mockQuestion
      })
    });
    expect(getReasonMock).not.toHaveBeenCalled();
  });

  it('should handle empty id', async () => {
    process.env.USE_MOCK_API = 'false';
    const emptyId = '';

    await expect(getReason(emptyId, mockQuestion)).rejects.toThrow(
      'Id не может быть пустым'
    );

    expect(mockFetch).not.toHaveBeenCalled();
    expect(getReasonMock).not.toHaveBeenCalled();
  });

  it('should handle empty question', async () => {
    process.env.USE_MOCK_API = 'false';
    const emptyQuestion = '';

    await expect(getReason(mockId, emptyQuestion)).rejects.toThrow(
      'Question не может быть пустым'
    );

    expect(mockFetch).not.toHaveBeenCalled();
    expect(getReasonMock).not.toHaveBeenCalled();
  });

  it('should handle undefined response data', async () => {
    process.env.USE_MOCK_API = 'false';
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue(undefined)
    });

    const result = await getReason(mockId, mockQuestion);

    expect(mockFetch).toHaveBeenCalledWith(`${mockServerApi}/reason`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: mockId,
        question: mockQuestion
      })
    });
    expect(result).toBeUndefined();
    expect(getReasonMock).not.toHaveBeenCalled();
  });
});
