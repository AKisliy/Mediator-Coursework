import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Blogger } from '@/types/blogger';

import { CsvFieldsForm } from './csv-fields-form';

export default function CsvButton({
  iconStyle,
  bloggers,
  includeText = false
}: {
  iconStyle: string;
  bloggers: Blogger[];
  includeText?: boolean;
}) {
  const t = useTranslations('search.toolbar.csv');
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" asChild>
          {includeText ? (
            <div className="flex items-center gap-2">
              <Download className={iconStyle} />
              <span className="ml-2">{t('dialogButton')}</span>
            </div>
          ) : (
            <Download className={iconStyle} />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-1/2">
        <ScrollArea>
          <DialogHeader className="mb-4">
            <DialogTitle>{t('dialogTitle')}</DialogTitle>
            <DialogDescription>{t('dialogDescription')}</DialogDescription>
          </DialogHeader>
          <CsvFieldsForm bloggers={bloggers} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
