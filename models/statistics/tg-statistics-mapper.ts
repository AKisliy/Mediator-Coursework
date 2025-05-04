import { AdPostMetrics } from './ad-post-metrics';
import { CitationMetrics } from './citation-metrics';
import { Metrics } from './common-metrics';
import { EngagementMetrics } from './engagement-metrics';
import { PerformanceMetrics } from './performance-metrics';
import { StatEntity } from './stat-entity';
import { StoryMetrics } from './story-metrics';
import { TgStats } from './tg-stats';

export default function MapStatistics(metadata: any): TgStats {
  const result = {} as TgStats;
  result.performanceMetrics = new StatEntity(
    'Perfomance',
    Metrics.getMetrics(PerformanceMetrics, metadata.performance_metrics)
  );
  result.storyMetrics = new StatEntity(
    'Статистика историй',
    Metrics.getMetrics(StoryMetrics, metadata.story_metrics)
  );
  result.engagementMetrics = new StatEntity(
    'Вовлеченность пользователей',
    Metrics.getMetrics(EngagementMetrics, metadata.engagement_metrics)
  );
  result.adPostsMetrics = new StatEntity(
    'Рекламные посты',
    Metrics.getMetrics(AdPostMetrics, metadata.ad_post_metrics)
  );
  result.citationMetrics = new StatEntity(
    'Цитирование',
    Metrics.getMetrics(CitationMetrics, metadata.citation_metrics)
  );

  return result;
}
