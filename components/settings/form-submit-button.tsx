import { useTranslations } from 'next-intl';
import React from 'react';

import SubmitButton from '../auth/submit-button';

export default function FormSubmitButton({
  isDirty,
  isLoading
}: {
  isDirty: boolean;
  isLoading: boolean;
}) {
  const t = useTranslations('settings');
  return (
    <SubmitButton
      isLoading={isLoading}
      variant="outline"
      className="w-full md:w-fit float-right"
      isDisabled={!isDirty || isLoading}
      buttonText={t('submitButton')}
      loadingText={t('loadingButton')}
    />
  );
}
