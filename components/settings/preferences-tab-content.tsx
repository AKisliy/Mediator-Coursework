import { Computer, Globe, Moon, Sun } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { PreferencesFormSchemaValues } from '@/schemas';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { TabsContent } from '../ui/tabs';
import FormSubmitButton from './form-submit-button';

export default function PreferencesTabContent({
  form
}: {
  form: UseFormReturn<PreferencesFormSchemaValues>;
}) {
  const onSubmit = (data: PreferencesFormSchemaValues) => {
    console.log(data);
  };

  return (
    <TabsContent value="preferences" className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Тема</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-3 gap-2"
                  >
                    <div
                      className={`flex flex-col items-center gap-2 p-2 border rounded-md ${field.value === 'light' ? 'border-primary' : 'border-zinc-800'}`}
                    >
                      <RadioGroupItem
                        value="light"
                        id="light"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="light"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Sun className="h-6 w-6 mb-1" />
                        <span>Светлая</span>
                      </Label>
                    </div>
                    <div
                      className={`flex flex-col items-center gap-2 p-2 border rounded-md ${field.value === 'dark' ? 'border-primary' : 'border-zinc-800'}`}
                    >
                      <RadioGroupItem
                        value="dark"
                        id="dark"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="dark"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Moon className="h-6 w-6 mb-1" />
                        <span>Темная</span>
                      </Label>
                    </div>
                    <div
                      className={`flex flex-col items-center gap-2 p-2 border rounded-md ${field.value === 'system' ? 'border-primary' : 'border-zinc-800'}`}
                    >
                      <RadioGroupItem
                        value="system"
                        id="system"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="system"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Computer className="h-6 w-6 mb-1" />
                        <span>Системная</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Язык</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div
                      className={`flex items-center gap-2 p-2 border rounded-md ${field.value === 'ru' ? 'border-primary' : 'border-zinc-800'}`}
                    >
                      <RadioGroupItem value="ru" id="ru" className="sr-only" />
                      <Label
                        htmlFor="ru"
                        className="cursor-pointer flex items-center gap-2 w-full"
                      >
                        <Globe className="h-5 w-5" />
                        <span>Русский</span>
                      </Label>
                    </div>
                    <div
                      className={`flex items-center gap-2 p-2 border rounded-md ${field.value === 'en' ? 'border-primary' : 'border-zinc-800'}`}
                    >
                      <RadioGroupItem value="en" id="en" className="sr-only" />
                      <Label
                        htmlFor="en"
                        className="cursor-pointer flex items-center gap-2 w-full"
                      >
                        <Globe className="h-5 w-5" />
                        <span>English</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSubmitButton
            isDirty={form.formState.isDirty}
            isLoading={form.formState.isSubmitting}
          />
        </form>
      </Form>
    </TabsContent>
  );
}
