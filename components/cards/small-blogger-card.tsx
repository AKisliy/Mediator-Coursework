import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Blogger } from '@/types/blogger';
import { isInstBlogger, isTelegramBlogger } from '@/types/type-guards';
import { FaInstagram, FaTelegram } from 'react-icons/fa';

export default function SmallBloggerCard({
  blogger,
  onClick
}: {
  blogger: Blogger;
  onClick: () => void;
}) {
  return (
    <Card key={blogger.id} onClick={onClick}>
      <CardHeader>
        <div className="flex justify-between gap-2">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={blogger.image_link} />
              <AvatarFallback>
                {blogger?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{blogger.username}</CardTitle>
              <CardDescription>{blogger.category ?? ''}</CardDescription>
            </div>
          </div>
          {isInstBlogger(blogger) && <FaInstagram size={30} />}
          {isTelegramBlogger(blogger) && <FaTelegram size={30} />}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Подписчики:</strong>{' '}
          {blogger?.followers_count?.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
