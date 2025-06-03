import { useTranslations } from 'next-intl';
import React from 'react';
import { Control } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { CsvFieldsSchemaValues } from '@/schemas';

const SOCIAL_MEDIA_OPTIONS = ['Telegram', 'Instagram'] as const;

export default function SocialMediaFormField({
  control
}: {
  control: Control<CsvFieldsSchemaValues>;
}) {
  const t = useTranslations('search.toolbar.csv');
  return (
    <FormField
      control={control}
      name="social_media"
      render={({ field }) => (
        <FormItem className="space-y-3 rounded-md border p-4">
          <FormLabel>{t('socialMedia')}</FormLabel>
          <div className="flex flex-row gap-4">
            {SOCIAL_MEDIA_OPTIONS.map(option => (
              <FormControl key={option}>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={field.value?.includes(option)}
                    onCheckedChange={checked => {
                      if (checked) {
                        field.onChange([...field.value, option]);
                      } else {
                        field.onChange(field.value.filter(v => v !== option));
                      }
                    }}
                  />
                  <FormLabel className="font-normal">{option}</FormLabel>
                </div>
              </FormControl>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
