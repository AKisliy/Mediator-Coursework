import { BloggerEntity } from './blogger';

export class InstBloggerEntity extends BloggerEntity {
  publications_count: number;

  following_count: number;

  constructor(object: any) {
    super(object);
    const metadata = object.metadata || {};
    this.publications_count = metadata.publications_count || 0;
    this.following_count = metadata.following_count || 0;
    this.profile_link = `https://www.instagram.com/${this.username}`;
  }
}
