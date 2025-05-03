'use server';

import { getContextUserId, withAuth } from '@/lib/auth-wrapper';
import { MOCK_USERNAME } from '@/lib/mock/config';

async function sendFeedbackAction(requestId: string, givenScore: number) {
  const userId = getContextUserId();
  const url = `${process.env.SERVER_API}/feedback`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uuid: requestId,
      score: givenScore,
      username: MOCK_USERNAME
    })
  });

  if (!response || !response.ok) {
    throw new Error(`Ошибка отправки фидбека: ${response?.statusText}`);
  }

  const data = await response.json();
  return data;
}

export const sendFeedback = withAuth(sendFeedbackAction);
