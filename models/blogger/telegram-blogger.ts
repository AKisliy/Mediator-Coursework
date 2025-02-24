import { BloggerEntity } from './blogger';
import MapStatistics from '../statistics/tg-statistics-mapper';
import { TgStats } from '../statistics/tg-stats';

export class TelegramBloggerEntity extends BloggerEntity {
  avg_post_reach: number;

  channel_title: string;

  statistics: TgStats;

  constructor(dataObject: any) {
    super(dataObject);
    const { metadata } = dataObject;
    this.avg_post_reach = metadata.avg_post_reach ?? 0;
    this.channel_title = metadata.channel_title ?? '';
    this.statistics = MapStatistics(metadata);
    this.profile_link = `https://t.me/${this.username}`;
  }
}
