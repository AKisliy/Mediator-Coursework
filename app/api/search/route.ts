import { SearchRequestDTO } from '@/models/request/search-request';
import { NextResponse } from 'next/server';
import { TaskManager } from '@/lib/task-manager';
import { generateMockBloggers } from '@/lib/mock/bloggers';
import { SearchResponseDTO } from '@/models/response/search-response';
import { addSearchToHistory } from '@/app/actions/search-history';
import { withAuth } from '../auth/utils';

export const POST = withAuth(async (req: Request, userId: string) => {
  const url = `${process.env.SERVER_API}/search`;
  const body = (await req.json()) as SearchRequestDTO;

  if (!body || !body.query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }
  const taskId = TaskManager.createTask();
  getReccomendtaionFromServer(url, body, userId, taskId);

  return NextResponse.json({ taskId });
});

async function getReccomendtaionFromServer(
  url: string,
  body: SearchRequestDTO,
  userId: string,
  taskId: string
) {
  try {
    if (process.env.USE_MOCK_API === 'true') {
      const result = generateMockBloggers(body.query, body.k);
      await addSearchToHistory(result.uuid, body.query);
      TaskManager.completeTask(taskId, result);
      return;
    }
    console.log(`Sent request: ${body}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: body.query,
        k: body.k,
        user_id: userId
      })
    });

    if (!response.ok) {
      TaskManager.failTask(taskId, response.statusText);
      return;
    }

    const res = (await response.json()) as SearchResponseDTO;
    await addSearchToHistory(res.uuid, body.query);
    TaskManager.completeTask(taskId, res);
  } catch (e: any) {
    TaskManager.failTask(taskId, e.message);
  }
}
