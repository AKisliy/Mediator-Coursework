import { Metrics } from './common-metrics';

export class CitationMetrics extends Metrics {
  override fieldsMapping = {
    Reposts: 'reposts',
    Mentions: 'mentions',
    'Citation Index': 'citationIndex',
    'Channels Mentioned': 'channelsMentioned'
  };

  override fieldsDisplayNames = {
    Reposts: 'Репосты',
    Mentions: 'Упоминания',
    'Citation Index': 'Индекс цитирования',
    'Channels Mentioned': 'Упоминания каналов'
  };
}
