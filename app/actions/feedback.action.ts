'use server';

import { MOCK_USERNAME } from '@/lib/mock/config';

export async function sendFeedback(requestId: string, givenScore: number) {
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
    throw new Error(`Ошибка отправки фидбека: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
