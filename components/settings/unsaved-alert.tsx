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
  return (
    <AlertDialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle>Несохраненные изменения</AlertDialogTitle>
          <AlertDialogDescription>
            У вас есть несохраненные изменения. Вы уверены, что хотите закрыть
            окно настроек?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-zinc-800 hover:bg-zinc-700"
            onClick={() => setShowUnsavedWarning(false)}
          >
            Вернуться к настройкам
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>
            Закрыть без сохранения
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
