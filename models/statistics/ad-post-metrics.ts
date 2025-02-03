import { Metrics } from './common-metrics';

export class AdPostMetrics extends Metrics {
  override fieldsMapping = {
    'In 12 hours': 'in12Hours',
    'In 24 hours': 'in24Hours',
    'In 48 hours': 'in48Hours',
    'Average Ad Post Reach': 'avgAdPostReach'
  };

  override fieldsDisplayNames = {
    'In 12 hours': 'За 12 часов',
    'In 24 hours': 'За 24 часа',
    'In 48 hours': 'За 48 часов',
    'Average Ad Post Reach': 'Средний охват рекламного поста'
  };
}
