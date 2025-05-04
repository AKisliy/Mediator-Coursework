export interface FilterValue {
  id: string;
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

export interface UserFilterValue {
  id: string;
  value: [number, number];
}

export interface UserFilterSet {
  name: string;
  filters: UserFilterValue[];
}
