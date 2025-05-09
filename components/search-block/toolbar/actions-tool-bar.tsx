'use client';

import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useBloggersQuery } from '@/context/bloggers-query-provider';

import ApproveButton from './approve-button';
import CsvButton from './csv-button';
import DislikeButton from './dislike-button';

const TooltipWrapper = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));
TooltipWrapper.displayName = 'TooltipWrapper';

type FeedbackState = 'dislike' | 'like' | null;

export default function ActionsToolBar({
  includeFeedback = false
}: {
  includeFeedback?: boolean;
}) {
  const t = useTranslations('search.toolbar');
  const [feedbackState, setFeedbackState] = useState<FeedbackState>(null);
  const [animatingButton, setAnimatingButton] = useState<string | null>(null);

  const iconStyle =
    'w-14 md:w-16 h-14 md:h-16 cursor-pointer transition-all duration-300 ease-in-out';

  const { bloggers } = useBloggersQuery();

  const handleApprove = () => {
    if (feedbackState !== null) return;

    setAnimatingButton('approve');
    setFeedbackState('like');

    setTimeout(() => {
      setAnimatingButton(null);
    }, 600);
  };

  const handleDislike = () => {
    if (feedbackState !== null) return;

    setAnimatingButton('dislike');
    setFeedbackState('dislike');

    setTimeout(() => {
      setAnimatingButton(null);
    }, 600);
  };

  const getButtonClassName = (buttonType: 'approve' | 'dislike') => {
    const isSelected =
      (buttonType === 'approve' && feedbackState === 'like') ||
      (buttonType === 'dislike' && feedbackState === 'dislike');

    const isDisabled =
      (buttonType === 'approve' && feedbackState === 'dislike') ||
      (buttonType === 'dislike' && feedbackState === 'like');

    const isAnimating = animatingButton === buttonType;

    let className = 'transition-all duration-300 ease-in-out transform';

    if (isDisabled) {
      className += ' opacity-30 cursor-not-allowed scale-90';
    } else if (isSelected) {
      className += ' scale-110 drop-shadow-lg';
    } else {
      className += ' hover:scale-105 hover:drop-shadow-md';
    }

    if (isAnimating) {
      className += ' animate-pulse scale-125';
    }

    return className;
  };

  return (
    <div className="flex justify-center space-x-8 mb-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <TooltipWrapper>
              <CsvButton iconStyle={iconStyle} bloggers={bloggers} />
            </TooltipWrapper>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('downloadCsv')}</p>
          </TooltipContent>
        </Tooltip>
        {includeFeedback && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <TooltipWrapper className={getButtonClassName('approve')}>
                  <ApproveButton
                    iconStyle={iconStyle}
                    onClick={handleApprove}
                    disabled={feedbackState === 'dislike'}
                    isSelected={feedbackState === 'like'}
                  />
                </TooltipWrapper>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('goodRecommendations')}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <TooltipWrapper className={getButtonClassName('dislike')}>
                  <DislikeButton
                    iconStyle={iconStyle}
                    onClick={handleDislike}
                    disabled={feedbackState === 'like'}
                    isSelected={feedbackState === 'dislike'}
                  />
                </TooltipWrapper>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('badRecommendations')}</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </TooltipProvider>
    </div>
  );
}
