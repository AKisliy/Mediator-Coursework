import { Metrics } from './common-metrics';

export class PerformanceMetrics extends Metrics {
  override fieldsMapping = {
    ERR: 'err',
    ERR24: 'err24',
    'Average Reach per Post': 'avgReachPerPost'
  };

  override fieldsDisplayNames = {
    ERR: 'ERR',
    ERR24: 'ERR24',
    'Average Reach per Post': 'Средний охват поста'
  };
}
