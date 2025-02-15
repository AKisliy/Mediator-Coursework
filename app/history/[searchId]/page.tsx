export default function HistoryEntry({
  params
}: {
  params: { searchId: string };
}) {
  return <p>Вы просматриваете: {params.searchId}</p>;
}
