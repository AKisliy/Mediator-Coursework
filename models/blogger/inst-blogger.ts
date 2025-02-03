import { Blogger } from './blogger';

export class InstBlogger extends Blogger {
  publications_count: number;

  following_count: number;

  constructor(object: any) {
    super(object);
    const metadata = object.metadata || {};
    this.publications_count = metadata.publications_count || 0;
    this.following_count = metadata.following_count || 0;
  }

  getProfileLink(): string {
    return `https://www.instagram.com/${this.username}`;
  }
}
