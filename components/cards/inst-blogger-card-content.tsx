import { InstBlogger } from '@/models/blogger/inst-blogger';

export function InstBloggerCardContent({ blogger }: { blogger: InstBlogger }) {
  return (
    <div className="space-y-4">
      <p className="text-base">{blogger?.description?.toLocaleString()}</p>
      <hr />
      <p className="text-sm">
        <strong>Followers:</strong> {blogger?.followers_count?.toLocaleString()}
      </p>
      <p className="text-sm">
        <strong>Following:</strong> {blogger.following_count.toLocaleString()}
      </p>
      <p className="text-sm">
        <strong>Posts:</strong> {blogger.publications_count.toLocaleString()}
      </p>
    </div>
  );
}
