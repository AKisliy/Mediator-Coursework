import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getReason } from '@/app/actions/reason.action';
import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { getReasonLocalStorageKey } from '@/lib/utils';
import { TypewriterText } from '../typewriter-text';
import { Button } from '../ui/button';

export default function ReasonButton({ bloggerId }: { bloggerId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [firstFind, setFirstFind] = useState(false);
  const [reason, setReason] = useState<string | null>('');

  const { query, requestId } = useBloggersQuery();
  const reasonStorageKey = getReasonLocalStorageKey(bloggerId, requestId);

  useEffect(() => {
    const storedReason = localStorage.getItem(reasonStorageKey);
    setReason(storedReason);
  }, [bloggerId, reasonStorageKey]);

  const handleGetReason = async () => {
    setFirstFind(true);
    setIsLoading(true);
    try {
      const newReason = await getReason(bloggerId, query);
      if (!newReason) throw new Error();
      setReason(newReason);
      localStorage.setItem(reasonStorageKey, newReason);
    } catch {
      setReason('Извините, не удалось выяснить причину');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`mt-4 flex flex-row ${reason ? 'items-start' : 'items-center'} gap-4`}
    >
      <p className="text-sm ">
        <strong>Причина:</strong>
      </p>
      <AnimatePresence mode="wait">
        {!isLoading && !reason && (
          <motion.div
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="relative p-1 rounded-md bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 
                    bg-[length:200%_200%] animate-border-gradient"
            >
              <Button
                className="relative w-fit z-10 px-6 py-3 rounded-md hover:bg-transparent"
                onClick={handleGetReason}
              >
                Почему он?
              </Button>
            </div>
          </motion.div>
        )}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p
              className="
                            text-sm 
                            bg-clip-text 
                            text-transparent 
                            bg-[linear-gradient(to_right,theme(colors.gray.600),theme(colors.gray.400),theme(colors.gray.200),white,theme(colors.gray.200),theme(colors.gray.400),theme(colors.gray.600))] bg-[length:200%_auto] animate-gptgradient"
            >
              Выясняем причину...
            </p>
          </motion.div>
        )}
        {reason && firstFind && (
          <motion.div
            key="response"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <TypewriterText text={reason} />
          </motion.div>
        )}
        {reason && !firstFind && <p className="text-sm">{reason}</p>}
      </AnimatePresence>
    </div>
  );
}
