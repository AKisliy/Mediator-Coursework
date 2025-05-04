'use server';

import { getReasonMock } from '@/lib/mock/reason';

export async function getReason(id: string, question: string) {
  if (!id) throw new Error('Id не может быть пустым');
  if (!question) throw new Error('Question не может быть пустым');
  if (process.env.USE_MOCK_API === 'true') return getReasonMock();
  const url = `${process.env.SERVER_API}/reason`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key: id,
      question
    })
  });

  if (!response || !response.ok) throw new Error(response?.statusText);

  const data = await response.json();

  return data?.result;
}
