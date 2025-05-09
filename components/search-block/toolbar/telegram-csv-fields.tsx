import { useTranslations } from 'next-intl';
import React from 'react';
import { Control } from 'react-hook-form';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { CsvFieldsSchemaValues } from '@/schemas';
import { TELEGRAM_BLOGGER_FIELDS } from '@/types/blogger';

export default function TelegramCsvFields({
  control
}: {
  control: Control<CsvFieldsSchemaValues>;
}) {
  const t = useTranslations('search.toolbar.csv.telegram');
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('accordionTrigger')}</AccordionTrigger>
        <AccordionContent>
          {Object.entries(TELEGRAM_BLOGGER_FIELDS).map(([field, label]) => (
            <FormField
              key={field}
              control={control}
              name={field as keyof typeof TELEGRAM_BLOGGER_FIELDS}
              render={({ field: formField }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={formField.value}
                      onCheckedChange={formField.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{label}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
