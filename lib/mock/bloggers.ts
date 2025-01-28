import { v4 as uuidv4 } from 'uuid';

export const generateMockBloggers = (query: string) => Array(10)
    .fill(null)
    .map(() => ({
      id: uuidv4(),
      metadata: {
        username: `devilsolicitor`,
        image_link:
          'https://t.me/i/userpic/320/Jjxlg-GQwkJFAYLcihFpzW1LA0HzKQ_oONIFaH5l4io.jpg',
        category: 'Мотивация',
        avg_post_reach: Math.floor(Math.random() * 1000000) + 10000,
        followers_count: Math.floor(Math.random() * 1000000) + 10000,
        social_media: 'Telegram',
        channel_title: 'Biba and boba',
        description:
          'Cool channel about motivation. Cool channel about motivation. Cool channel about motivation. Cool channel about motivation. Cool channel about motivation. Cool channel about motivation. Cool channel about motivation. Cool channel about motivation. Cool channel about motivation. Cool channel about motivation. Cool channel about motivation',
        reason: `This blogger aligns well with your query "${query}" due to their expertise in ${['technology', 'fashion', 'food', 'travel', 'fitness'][Math.floor(Math.random() * 5)]}.`,
        citation_metrics: {
          Reposts: 0,
          Mentions: 320,
          'Citation Index': 4.7,
          'Channels Mentioned': 320
        },
        engagement_metrics: {
          Comments: null,
          Forwards: 1,
          Reactions: null,
          'Subscriber Engagement (ER)': 20
        },
        performance_metrics: {
          ERR: 71.5,
          ERR24: 209.2,
          'Average Reach per Post': 724
        }
      }
    }));
