import SmallBloggerCardSkeleton from './cards/small-blogger-card-skeleton';

export default function BloggersGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 auto-rows-fr">
      {Array.from({ length: 6 }).map((_, index) => (
        <SmallBloggerCardSkeleton key={index} />
      ))}
    </div>
  );
}
