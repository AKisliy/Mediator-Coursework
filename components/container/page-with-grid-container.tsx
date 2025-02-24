export default function PageWithGridContainer({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto p-4 max-w-4xl">{children}</div>;
}
