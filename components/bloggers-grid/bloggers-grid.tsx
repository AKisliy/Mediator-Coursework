'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Blogger } from '@/types/blogger';
import { BloggersGridConfig } from '@/types/bloggers-grid-config';

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
  const t = useTranslations('search');

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
      <p className="text-center mt-7 text-muted-foreground text-sm md:text-base">
        {t('openCardTip')}
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
