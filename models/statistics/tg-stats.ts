import { AdPostMetrics } from './ad-post-metrics';
import { CitationMetrics } from './citation-metrics';
import { EngagementMetrics } from './engagement-metrics';
import { PerformanceMetrics } from './performance-metrics';
import { StatEntity } from './stat-entity';
import { StoryMetrics } from './story-metrics';

export interface TgStats {
  followersCount: StatEntity<number | null>;
  storyMetrics: StatEntity<StoryMetrics | null>;
  adPostsMetrics: StatEntity<AdPostMetrics | null>;
  citationMetrics: StatEntity<CitationMetrics | null>;
  engagementMetrics: StatEntity<EngagementMetrics | null>;
  performanceMetrics: StatEntity<PerformanceMetrics | null>;
}
