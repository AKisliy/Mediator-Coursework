'use client';

import { ThumbsUp } from 'lucide-react';
import React from 'react';

import { sendFeedback } from '@/app/actions/feedback.action';
import { Button } from '@/components/ui/button';
import { useBloggersQuery } from '@/context/bloggers-query-provider';

export default function ApproveButton({ iconStyle }: { iconStyle: string }) {
  const { requestId } = useBloggersQuery();
  const sendPositiveFeedback = async () => {
    if (!requestId)
      throw new Error(
        'Невозможно отправить обратную связь без текущего запроса'
      );
    const result = await sendFeedback(requestId, 1);
    console.log(result);
  };

  return (
    <Button onClick={() => sendPositiveFeedback()} variant="ghost" asChild>
      <ThumbsUp className={iconStyle} />
    </Button>
  );
}
