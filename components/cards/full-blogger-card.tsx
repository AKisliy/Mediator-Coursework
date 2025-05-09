import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Blogger } from '@/types/blogger';
import { BloggersGridConfig } from '@/types/bloggers-grid-config';
import { isInstBlogger, isTelegramBlogger } from '@/types/type-guards';

import ReasonButton from '../buttons/reason-button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { InstBloggerCardContent } from './inst-blogger-card-content';
import { TelegramBloggerCardContent } from './tg-blogger-card-content';

export default function FullBloggerCard({
  blogger,
  onClose,
  config
}: {
  blogger: Blogger;
  onClose: () => void;
  config?: BloggersGridConfig;
}) {
  const t = useTranslations('search.bloggerCard');
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        layoutId={`card-${blogger.id}`}
        className="card rounded-lg shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <Card key={blogger.id} className="max-h-screen overflow-y-auto">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={blogger.image_link} />
                  <AvatarFallback>
                    {blogger?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{blogger.username}</h2>
                  <p className="text-sm text-muted-foreground">
                    {blogger.category}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isTelegramBlogger(blogger) && (
              <TelegramBloggerCardContent blogger={blogger} />
            )}
            {isInstBlogger(blogger) && (
              <InstBloggerCardContent blogger={blogger} />
            )}
            {(!config || config.needReasonButton !== false) && (
              <ReasonButton bloggerId={blogger.id} />
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full mt-6" asChild>
              <a
                href={blogger.profile_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('goToProfile')}
              </a>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
