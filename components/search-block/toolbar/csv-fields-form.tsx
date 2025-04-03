'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Download } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { exportBloggersToCSV } from '@/lib/csv/export-util';
import { CsvFieldsSchemaValues, csvFieldsSchema } from '@/schemas';
import { BLOGGER_FIELDS } from '@/types/blogger';

import InstagramCsvFields from './instagram-csv-fields';
import SocialMediaFormField from './social-media-form-field';
import TelegramCsvFields from './telegram-csv-fields';

export function CsvFieldsForm() {
  const form = useForm<CsvFieldsSchemaValues>({
    resolver: zodResolver(csvFieldsSchema),
    defaultValues: {
      followers_count: true,
      social_media: ['Telegram']
    }
  });

  const { bloggers } = useBloggersQuery();

  function onSubmit(data: CsvFieldsSchemaValues) {
    exportBloggersToCSV(bloggers, data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SocialMediaFormField control={form.control} />
        {Object.entries(BLOGGER_FIELDS).map(([field, label]) => (
          <FormField
            key={field}
            control={form.control}
            name={field as keyof typeof BLOGGER_FIELDS}
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
        {form.getValues('social_media').includes('Telegram') && (
          <TelegramCsvFields control={form.control} />
        )}
        {form.getValues('social_media').includes('Instagram') && (
          <InstagramCsvFields control={form.control} />
        )}
        <Button type="submit">
          <Download />
          Загрузить
        </Button>
      </form>
    </Form>
  );
}
