'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Languages, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LocaleLoadingOverlayProps {
  isVisible: boolean;
}

export function LocaleLoadingOverlay({ isVisible }: LocaleLoadingOverlayProps) {
  const t = useTranslations('common');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4 rounded-lg bg-card p-8 shadow-lg border"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear'
                }}
              >
                <Loader2 className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="absolute -top-1 -right-1"
              >
                <Languages className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-center"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {t('translating')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('translatingDescription')}
              </p>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-1 bg-primary rounded-full"
              style={{ width: '120px' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
