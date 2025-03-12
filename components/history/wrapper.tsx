import { loadMoreSearchEntries } from '@/data/history';
import HistoryEntries from './history-entries';

export default async function HistoryEntriesWrapper() {
  const initialEntries = await loadMoreSearchEntries(0);
  return <HistoryEntries initialEntries={initialEntries ?? []} />;
}
