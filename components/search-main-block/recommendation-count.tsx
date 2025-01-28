import { Input } from '@/components/ui/input';
import { Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RecommendationCountInput({
  count,
  setCount,
  countLimit
}: {
  count: number;
  setCount: (x: number) => void;
  countLimit: number;
}) {
  const [inputValue, setInputValue] = useState(count.toString());
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInputValue(count.toString());
  }, [count]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
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
    setCount(numValue);
  };

  return (
    <div className="flex items-center space-x-2">
      <Users className="w-5 h-5 text-gray-500" />
      <Input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        className={`w-[100px] ${isValid ? '' : 'border-red-500'}`}
        min="1"
        max={countLimit}
      />
      <span className="text-sm text-gray-500">блогеров</span>
    </div>
  );
}
