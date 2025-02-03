import { AnimatePresence, motion } from 'framer-motion';
import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { getBloggerFromObject } from '@/models/blogger/utils';
import { Blogger } from '@/models/blogger/blogger';
import SmallBloggerCard from '../cards/small-blogger-card';
import ActionsToolBar from './actions-tool-bar';

export default function BloggersGrid({
  setSelectedBlogger
}: {
  setSelectedBlogger: (b: Blogger) => void;
}) {
  const { bloggers } = useBloggersQuery();
  return (
    <>
      <ActionsToolBar />
      <motion.div
        className="grid gap-6 md:grid-cols-2 auto-rows-fr"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {bloggers.map(blogger => {
            const bloggerEntity = getBloggerFromObject(blogger);
            return (
              <SmallBloggerCard
                key={bloggerEntity.id}
                blogger={bloggerEntity}
                onClick={() => {
                  setSelectedBlogger(bloggerEntity);
                }}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
      <p className="text-center mt-4 text-muted-foreground">
        Tap to open a card.
      </p>
    </>
  );
}
