'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

interface SubmitButtonProps {
  isLoading: boolean;
  buttonText: string;
  loadingText?: string;
}

export default function SubmitButton({
  isLoading,
  buttonText,
  loadingText
}: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {!isLoading ? (
        buttonText
      ) : (
        <div className="flex flex-row gap-2">
          {loadingText ?? 'Момент... '} <Loader2 className="animate-spin" />
        </div>
      )}
    </Button>
  );
}
