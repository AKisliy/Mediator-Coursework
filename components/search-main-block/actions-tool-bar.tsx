import { sendFeedback } from '@/app/actions/feedback';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { Download, ThumbsUp, ThumbsDown } from 'lucide-react';
import { exportBloggersToCSV } from '@/lib/utils';
import { Button } from '../ui/button';

export default function ActionsToolBar() {
  const { requestId, bloggers } = useBloggersQuery();

  const iconStyle =
    'w-16 h-16 cursor-pointer transition-all duration-300 ease-in-out';

  const sendFeedBack = async (score: number) => {
    if (!requestId)
      throw new Error(
        'Невозможно отправить обратную связь без текущего запроса'
      );
    const result = await sendFeedback(requestId, score);
    console.log(result);
  };

  return (
    <div className="flex justify-center space-x-8 mb-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => exportBloggersToCSV(bloggers)}
              variant="ghost"
              asChild
            >
              <Download className={iconStyle} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Загрузить CSV</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => sendFeedBack(1)} variant="ghost" asChild>
              <ThumbsUp className="w-16 h-16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Хорошие рекомендации 😃</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => sendFeedBack(0)} variant="ghost" asChild>
              <ThumbsDown className={iconStyle} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Плохие рекомендации 😐</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
