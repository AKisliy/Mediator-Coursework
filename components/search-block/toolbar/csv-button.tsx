import { Download } from 'lucide-react';
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

import { CsvFieldsForm } from './csv-fields-form';

export default function CsvButton({ iconStyle }: { iconStyle: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" asChild>
          <Download className={iconStyle} />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-1/2">
        <ScrollArea>
          <DialogHeader className="mb-4">
            <DialogTitle>Выгрузка CSV</DialogTitle>
            <DialogDescription>
              Выберите поля для создания CSV файла
            </DialogDescription>
          </DialogHeader>
          <CsvFieldsForm />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
