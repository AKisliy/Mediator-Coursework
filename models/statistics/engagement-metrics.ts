import { Metrics } from './common-metrics';

export class EngagementMetrics extends Metrics {
  override fieldsMapping = {
    Comments: 'comments',
    Forwards: 'forwards',
    Reactions: 'reactions',
    'Subscriber Engagement (ER)': 'er'
  };

  override fieldsDisplayNames = {
    Comments: 'Комментарии',
    Forwards: 'Пересылки',
    Reactions: 'Реакции',
    'Subscriber Engagement (ER)': 'ER'
  };
}
