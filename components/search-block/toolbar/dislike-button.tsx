'use client';

import { ThumbsDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { sendFeedback } from '@/app/actions/feedback.action';
import { Button } from '@/components/ui/button';
import { useBloggersQuery } from '@/context/bloggers-query-provider';

interface DislikeButtonProps {
  iconStyle: string;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
}

export default function DislikeButton({
  iconStyle,
  onClick,
  disabled = false,
  isSelected = false
}: DislikeButtonProps) {
  const t = useTranslations('search.toolbar.errors');
  const { requestId } = useBloggersQuery();

  const sendNegativeFeedback = async () => {
    if (!requestId) throw new Error(t('noRequestId'));
    await sendFeedback(requestId, 0);
  };

  const handleClick = async () => {
    if (disabled) return;

    // Вызываем внешний onClick для анимации
    if (onClick) {
      onClick();
    }

    // Отправляем feedback
    await sendNegativeFeedback();
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      asChild
      disabled={disabled}
      className={disabled ? 'pointer-events-none' : ''}
    >
      <ThumbsDown
        className={`${iconStyle} ${
          // eslint-disable-next-line no-nested-ternary
          isSelected
            ? 'text-red-500'
            : disabled
              ? 'text-gray-300'
              : 'hover:text-red-500'
        } transition-colors duration-200`}
      />
    </Button>
  );
}
