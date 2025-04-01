import { getUserSavedFilters } from '@/app/actions/user.actions';

import SearchFilters from './search-filter';

export default async function SearchFiltersServer() {
  const initialFilters = await getUserSavedFilters();
  return <SearchFilters initialFilters={initialFilters} />;
}
