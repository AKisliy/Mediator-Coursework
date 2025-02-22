'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Blogger } from '@/models/blogger/blogger';
import { formatTimestamp } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { Separator } from '../ui/separator';
import SmallBloggerCard from '../cards/small-blogger-card';

export default function ClientBloggerGrid({
  query,
  createdAt,
  bloggers
}: {
  query: string;
  createdAt: Date | undefined;
  bloggers: Blogger[];
}) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-col gap-4">
        <div className="text-base text-gray-300">Ваш запрос:</div>
        <div className="text-3xl">{query}</div>
        <div className="flex flex-row gap-1 items-center text-sm text-gray-300">
          <Clock className="size-4" />
          {formatTimestamp(createdAt ?? new Date(Date.now()))}
        </div>
      </div>
      <Separator className="my-6" />
      <div className="text-base text-gray-300">
        <div className="text-xl text-gray-300 mb-4">🚀 Результат:</div>
        <motion.div
          className="grid gap-6 md:grid-cols-2 auto-rows-fr"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {bloggers.map(blogger => (
              <SmallBloggerCard
                key={blogger.id}
                blogger={blogger}
                onClick={() => {
                  console.log('shis');
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        <p className="text-center mt-4 text-muted-foreground">
          Tap to open a card.
        </p>
      </div>
    </div>
  );
}
