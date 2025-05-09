import { useTranslations } from 'next-intl';
import { FaInstagram, FaTelegram } from 'react-icons/fa';

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

export default function SmallBloggerCard({
  blogger,
  onClick
}: {
  blogger: Blogger;
  onClick: () => void;
}) {
  const t = useTranslations('bloggers');
  return (
    <Card
      key={blogger.id}
      onClick={onClick}
      className="cursor-pointer w-full max-w-full overflow-hidden"
    >
      <CardHeader>
        <div className="flex justify-between gap-2">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Avatar className="flex-shrink-0">
              <AvatarImage src={blogger.image_link} />
              <AvatarFallback>
                {blogger?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate whitespace-nowrap overflow-hidden w-full leading-normal">
                {blogger.username}
              </CardTitle>
              <CardDescription className="truncate">
                {blogger.category ?? ''}
              </CardDescription>
            </div>
            <div className="flex-shrink-0">
              {isInstBlogger(blogger) && <FaInstagram size={30} />}
              {isTelegramBlogger(blogger) && <FaTelegram size={30} />}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          <strong>{t('subscribers')}</strong>
          {': '}
          {blogger?.followers_count?.toLocaleString('ru-RU', {
            useGrouping: true
          })}
        </p>
      </CardContent>
    </Card>
  );
}
