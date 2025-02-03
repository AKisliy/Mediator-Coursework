import { Metrics } from './common-metrics';

export class StoryMetrics extends Metrics {
  override fieldsMapping = {
    'In 6 hours': 'in6Hours',
    'In 12 hours': 'in12Hours',
    'In 24 hours': 'in24Hours',
    'Average Story Reach': 'avgStoryReach'
  };

  override fieldsDisplayNames = {
    'In 6 hours': 'За 6 часов',
    'In 12 hours': 'За 12 часов',
    'In 24 hours': 'За 24 часа',
    'Average Story Reach': 'Средний охват итсории'
  };
}
