import { useEffect, useState } from 'react';

export function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i: number = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i += 1;
      if (i > text.length) {
        clearInterval(intervalId);
      }
    }, 25);

    return () => clearInterval(intervalId);
  }, [text]);

  return <p className="text-sm">{displayedText}</p>;
}
