import { MOCK_REASON_TEXT } from './config';

export async function getReasonMock(): Promise<string> {
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });
  return MOCK_REASON_TEXT;
}
