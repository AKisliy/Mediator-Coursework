import { AuthorizedAccess } from '../decorators/authorized-access';

export class SearchBloggerAPI {
  @AuthorizedAccess
  static async searchBloggers(
    query: string,
    bloggersCount: number
  ): Promise<string> {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        k: bloggersCount
      })
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Ошибка при поиске блогеров: ${error}`);
    }

    const { taskId } = await response.json();
    return taskId;
  }
}
