import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Blogger } from '@/models/blogger/blogger';
import { InstBlogger } from '@/models/blogger/inst-blogger';
import { TelegramBlogger } from '@/models/blogger/telegram-blogger';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { InstBloggerCardContent } from './inst-blogger-card-content';
import { TGBloggerCardContent } from './tg-blogger-card-content';
import ReasonButton from '../buttons/reason-button';

export default function FullBloggerCard({
  blogger,
  onClose
}: {
  blogger: Blogger;
  onClose: () => void;
}) {
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
            {blogger instanceof TelegramBlogger ? (
              <TGBloggerCardContent blogger={blogger} />
            ) : (
              <InstBloggerCardContent blogger={blogger as InstBlogger} />
            )}
            <ReasonButton bloggerId={blogger.id} />
          </CardContent>
          <CardFooter>
            <Button className="w-full mt-6" asChild>
              <a
                href={blogger.getProfileLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Перейти к профилю
              </a>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
