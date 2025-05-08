import { FilterValue } from './search-filters';

export interface SearchQueueInterface {
  query: string;
  k: number;
  user_id: string;
  filters: FilterValue[];
}
