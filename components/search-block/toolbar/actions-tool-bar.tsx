import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import ApproveButton from './approve-button';
import CsvButton from './csv-button';
import DislikeButton from './dislike-button';

export default function ActionsToolBar() {
  const iconStyle =
    'w-16 h-16 cursor-pointer transition-all duration-300 ease-in-out';

  return (
    <div className="flex justify-center space-x-8 mb-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <CsvButton iconStyle={iconStyle} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Загрузить CSV</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ApproveButton iconStyle={iconStyle} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Хорошие рекомендации 😃</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <DislikeButton iconStyle={iconStyle} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Плохие рекомендации 😐</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
