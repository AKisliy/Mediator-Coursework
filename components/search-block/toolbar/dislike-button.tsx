'use client';

import { ThumbsDown } from 'lucide-react';
import React from 'react';

import { sendFeedback } from '@/app/actions/feedback.action';
import { Button } from '@/components/ui/button';
import { useBloggersQuery } from '@/context/bloggers-query-provider';

export default function DislikeButton({ iconStyle }: { iconStyle: string }) {
  const { requestId } = useBloggersQuery();

  const sendNegativeFeedback = async () => {
    if (!requestId)
      throw new Error(
        'Невозможно отправить обратную связь без текущего запроса'
      );
    const result = await sendFeedback(requestId, 0);
    console.log(result);
  };
  return (
    <Button onClick={() => sendNegativeFeedback()} variant="ghost" asChild>
      <ThumbsDown className={iconStyle} />
    </Button>
  );
}
