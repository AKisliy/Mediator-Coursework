import { getUserSavedFilters } from '@/app/actions/data/user';

import SearchFilters from './search-filter';

export default async function SearchFiltersServer() {
  const initialFilters = await getUserSavedFilters();
  return <SearchFilters initialFilters={initialFilters} />;
}
