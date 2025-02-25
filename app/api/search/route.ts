import { SearchRequestDTO } from '@/models/request/search-request';
import { NextResponse } from 'next/server';
import { TaskManager } from '@/lib/task-manager';
import { generateMockBloggers } from '@/lib/mock/bloggers';
import {
  SearchResponse,
  SearchResponseDTO
} from '@/models/response/search-response';
import { transformRecommendations } from '@/models/blogger/blogger-mappings';
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
      const response = generateMockBloggers(body.query, body.k);
      const bloggers = transformRecommendations(response.recommendations);
      const result: SearchResponse = {
        uuid: response.uuid,
        recommendations: bloggers
      };
      // await addSearchToHistory(result.uuid, body.query, result.recommendations);
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
    const parsedBloggers = transformRecommendations(res.recommendations);
    await addSearchToHistory(res.uuid, body.query, parsedBloggers);
    TaskManager.completeTask(taskId, res);
  } catch (e: any) {
    TaskManager.failTask(taskId, e.message);
  }
}
