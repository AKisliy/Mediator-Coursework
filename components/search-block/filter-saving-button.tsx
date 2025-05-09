'use client';

import { Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { v4 } from 'uuid';

import { saveUserFilter } from '@/app/actions/data/user';
import { toast } from '@/hooks/use-toast';
import type { FilterValue, UserFilterValue } from '@/types/search-filters';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';

interface FilterSavingDialogButtonProps {
  filters: FilterValue[];
}

export default function FilterSavingDialogButton({
  filters
}: FilterSavingDialogButtonProps) {
  const { data: session } = useSession();
  const t = useTranslations('search.filters');

  const [nameInput, setNameInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFiltersSave = async () => {
    if (!session?.user.id) return;

    setIsSaving(true);
    const mappedFilters: UserFilterValue[] = filters.map(filter => ({
      id: filter.id,
      value: filter.value
    }));

    await saveUserFilter(mappedFilters, session?.user.id, nameInput, v4());
    setIsSaving(false);

    toast({
      title: t('saveSuccess', { name: nameInput }),
      description: t('saveSuccessDescription'),
      variant: 'default'
    });
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Save />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="p-3">
          <DialogTitle>{t('saveFilter')}</DialogTitle>
          <DialogDescription>{t('saveFilterDescription')}</DialogDescription>
        </DialogHeader>
        <div className="p-3 space-y-3">
          <Input
            placeholder={t('filterNamePlaceholder')}
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            className="w-full"
            type="text"
          />
        </div>
        <DialogFooter className="sticky -bottom-6 w-full h-full backdrop-blur-sm bg-black/80 p-4">
          <Button
            onClick={handleFiltersSave}
            className="w-1/3"
            disabled={!nameInput || isSaving}
          >
            {isSaving ? t('saving') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
