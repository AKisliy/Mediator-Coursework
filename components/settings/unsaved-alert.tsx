import { useTranslations } from 'next-intl';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog';

interface UnsavedAlertDialogProps {
  showUnsavedWarning: boolean;
  setShowUnsavedWarning: (b: boolean) => void;
  onAction: () => void;
}

export default function UnsavedAlertDialog({
  showUnsavedWarning,
  setShowUnsavedWarning,
  onAction
}: UnsavedAlertDialogProps) {
  const t = useTranslations('settings.unsavedAlert');
  return (
    <AlertDialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-zinc-800 hover:bg-zinc-700"
            onClick={() => setShowUnsavedWarning(false)}
          >
            {t('cancelButton')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>
            {t('leaveButton')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
