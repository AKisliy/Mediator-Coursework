'use client';

import { Loader, Trash2, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { DEFAULT_AVATAR_FILENAME } from '@/lib/constants';
import { generateAvatar } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function AvatarComponent({
  username,
  avatarUrl,
  setAvatarUrl,
  fallback,
  onPreviewUpload
}: {
  username?: string;
  avatarUrl?: string;
  setAvatarUrl: (s: string) => void;
  url?: string;
  fallback?: string;
  onPreviewUpload: (f: File) => void;
}) {
  const t = useTranslations('settings.avatar');
  const [uploading, setUploading] = useState(false);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async e => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error(t('error.noFile'));
      }

      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = event => {
          if (event.target?.result) {
            const result = event.target.result as string;
            setAvatarUrl(result);
            onPreviewUpload(file);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      alert(t('error.uploadingError'));
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const deleteUserAvatar = async () => {
    const avatartUri = generateAvatar(username ?? 'Default user');
    setAvatarUrl(avatartUri);
    onPreviewUpload(new File([], DEFAULT_AVATAR_FILENAME));
  };

  return (
    <div className="flex items-center gap-4">
      {uploading ? (
        <Loader />
      ) : (
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl} key={avatarUrl} />
          <AvatarFallback>{fallback?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-row gap-1">
        <Label
          htmlFor="avatar-upload"
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-primary rounded-md"
        >
          <Upload className="h-4 w-4" />
          {t('uploadButton')}
        </Label>
        <Input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadAvatar}
        />
        <Button variant="ghost" type="button" onClick={deleteUserAvatar}>
          <Trash2 color="red" />
        </Button>
      </div>
    </div>
  );
}
