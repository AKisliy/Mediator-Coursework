'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BloggersGridConfig } from '@/types/bloggers-grid-config';
import { Blogger } from '@/types/blogger';
import FullBloggerCard from '../cards/full-blogger-card';
import SmallBloggerCard from '../cards/small-blogger-card';

export default function BloggersGrid({
  bloggers,
  upperChild,
  config
}: {
  bloggers: Blogger[];
  upperChild?: React.ReactNode;
  config?: BloggersGridConfig;
}) {
  const [selectedBlogger, setSelectedBlogger] = useState<Blogger | null>(null);

  return (
    <>
      {upperChild}
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
                setSelectedBlogger(blogger);
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      <p className="text-center mt-7 text-muted-foreground">
        Нажмите на карточку, чтобы открыть 👆
      </p>
      <AnimatePresence>
        {selectedBlogger && (
          <FullBloggerCard
            blogger={selectedBlogger}
            onClose={() => setSelectedBlogger(null)}
            config={config}
          />
        )}
      </AnimatePresence>
    </>
  );
}
