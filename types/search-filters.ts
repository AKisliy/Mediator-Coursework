export interface FilterValue {
  min: number;
  max: number;
  name: string;
  measure?: string;
  value: [number, number];
  minStepsBetweenThumbs?: number;
  stepSize?: number;
  valueFormatter?: (value: number) => string;
  stringTemplate?: string;
}
