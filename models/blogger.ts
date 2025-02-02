import { v4 as uuidv4 } from 'uuid';
import { InstBlogger } from './inst-blogger';

export class Blogger {
  id: string;

  username: string | undefined;

  image_link: string | undefined;

  category: string | undefined;

  followers_count: number | undefined;

  social_media: string | undefined;

  description: string | undefined;

  reason: string | undefined;

  constructor(dataObject: any) {
    const bloggerObject = dataObject.metadata;
    Object.assign(this, bloggerObject ?? {});
    this.id = dataObject.id ?? uuidv4();
  }

  getProfileLink(): string | undefined {
    return this.username;
  }

  static getBloggerFromObject(blogerObject: any) {
    const blogger = blogerObject.metadata ?? {};
    if (!blogerObject) throw new Error('От сервера получен пустой ответ');
    if (blogger.social_media === 'Instagram')
      return new InstBlogger(blogerObject);
    return new Blogger(blogerObject);
  }
}
