import SearchButton from './search-button';
import SearchFiltersServer from './search-filters-server';
import SearchInput from './search-input';
import SearchResultsCount from './search-results-count';

export default function SearchBarUtils() {
  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex space-x-2">
        <SearchInput />
        <SearchFiltersServer />
        <SearchButton />
      </div>
      <SearchResultsCount />
    </div>
  );
}
