import { StatEntity } from './stat-entity';

export class Metrics {
  constructor() {
    return new Proxy(this, {
      get(target, prop: string) {
        if (!(prop in target) && target.fieldsDisplayNames) {
          const displayNames = target.fieldsDisplayNames;
          if (displayNames[prop]) {
            return new StatEntity(displayNames[prop], 'Нет данных');
          }
        }
        return target[prop as keyof typeof target];
      }
    });
  }

  fieldsMapping: Record<string, string> = {};

  fieldsDisplayNames: Record<string, string> = {};

  static getMetrics<T extends Metrics>(
    Constructor: new () => T,
    metrics: any
  ): T | null {
    if (!metrics) return null;
    const result = new Constructor();
    const nameToField = result.fieldsMapping;
    const nameToDisplayValue = result.fieldsDisplayNames;

    Object.keys(nameToField).forEach(key => {
      const fieldName = nameToField[key];
      const value = metrics[key];
      (result as any)[fieldName] = new StatEntity(
        nameToDisplayValue[key],
        value ?? 'Нет данных'
      );
    });

    return result;
  }
}
