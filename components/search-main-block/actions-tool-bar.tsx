import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Download, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function ActionsToolBar() {
  const iconStyle =
    'w-6 h-6 cursor-pointer transition-all duration-300 ease-in-out';
  const containerStyle = 'hover:bg-gray-100 rounded-full p-2';

  const sendFeedBack = async (score: number) => {
    console.log(`Number: ${score}`);
  };

  return (
    <div className="flex justify-center space-x-8 mb-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={containerStyle}>
              <Download
                className={iconStyle}
                onClick={() => console.log('Download CSV')}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download CSV</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className={containerStyle}>
              <ThumbsUp className={iconStyle} onClick={() => sendFeedBack(1)} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Good Recommendations</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className={containerStyle}>
              <ThumbsDown
                className={iconStyle}
                onClick={() => sendFeedBack(0)}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bad Recommendations</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
