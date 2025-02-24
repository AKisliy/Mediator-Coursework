import { v4 as uuidv4 } from 'uuid';
import { BloggerResponseDTO } from '../response/blogger-dto';

export class BloggerEntity {
  id: string;

  username: string | undefined;

  image_link: string | undefined;

  category: string | undefined;

  followers_count: number | undefined;

  social_media: string | undefined;

  description: string | undefined;

  reason: string | undefined;

  profile_link: string | undefined;

  constructor(dataObject: BloggerResponseDTO) {
    const bloggerObject = dataObject.metadata;
    Object.assign(this, bloggerObject ?? {});
    this.id = dataObject.id ?? uuidv4();
  }
}
