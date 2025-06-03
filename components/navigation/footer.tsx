import { useTranslations } from 'next-intl';
import { FaTelegram } from 'react-icons/fa';

import { Button } from '../ui/button';

export default function Footer() {
  const t = useTranslations('navigation.footer');
  return (
    <footer className="py-6  w-full mt-auto border-t">
      <div className="container w-full mx-auto px-4 flex justify-between items-center max-w-6xl">
        <h1 className="text-2xl font-bold">Mediator</h1>
        <Button
          variant="outline"
          asChild
          className="flex flex-row items-center gap-3"
        >
          <a
            href="https://t.me/collabguru"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram size={20} />
            {t('support')}
          </a>
        </Button>
      </div>
    </footer>
  );
}
