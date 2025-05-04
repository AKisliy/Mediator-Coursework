import React from 'react';

import SubmitButton from '../auth/submit-button';

export default function FormSubmitButton({
  isDirty,
  isLoading
}: {
  isDirty: boolean;
  isLoading: boolean;
}) {
  return (
    <SubmitButton
      isLoading={isLoading}
      variant="outline"
      className="w-fit float-right"
      isDisabled={!isDirty || isLoading}
      buttonText="Сохранить изменения"
      loadingText="Сохраняем"
    />
  );
}
