'use client';

import { ThumbsUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { sendFeedback } from '@/app/actions/feedback.action';
import { Button } from '@/components/ui/button';
import { useBloggersQuery } from '@/context/bloggers-query-provider';

interface ApproveButtonProps {
  iconStyle: string;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
}

export default function ApproveButton({
  iconStyle,
  onClick,
  disabled = false,
  isSelected = false
}: ApproveButtonProps) {
  const t = useTranslations('search.toolbar.errors');
  const { requestId } = useBloggersQuery();

  const sendPositiveFeedback = async () => {
    if (!requestId) throw new Error(t('noRequestId'));
    await sendFeedback(requestId, 1);
  };

  const handleClick = async () => {
    if (disabled) return;

    if (onClick) {
      onClick();
    }
    await sendPositiveFeedback();
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      asChild
      disabled={disabled}
      className={disabled ? 'pointer-events-none' : ''}
    >
      <ThumbsUp
        className={`${iconStyle} ${
          // eslint-disable-next-line no-nested-ternary
          isSelected
            ? 'text-green-500'
            : disabled
              ? 'text-gray-300'
              : 'hover:text-green-500'
        } transition-colors duration-200`}
      />
    </Button>
  );
}
