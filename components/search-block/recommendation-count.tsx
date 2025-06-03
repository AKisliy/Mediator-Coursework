import { Users } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { useBloggersQuery } from '@/context/bloggers-query-provider';

export default function RecommendationCountInput({
  countLimit
}: {
  countLimit: number;
}) {
  const { bloggersCount, setBloggersCount } = useBloggersQuery();

  const [inputValue, setInputValue] = useState(bloggersCount.toString());
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    const numValue = parseInt(value, 10);
    if (Number.isNaN(numValue)) {
      setIsValid(false);
      return;
    }
    if (numValue >= 1 && numValue <= countLimit) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
    setBloggersCount(numValue);
  };

  return (
    <div className="flex items-center space-x-2">
      <Users className="w-5 h-5 text-gray-500" />
      <Input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        className={`w-12 md:w-[100px] ${isValid ? '' : 'border-red-500'}`}
        min="1"
        max={countLimit}
      />
    </div>
  );
}
