'use client';

import { Upload } from 'lucide-react';
import React, { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function AvatarComponent({
  uid,
  url,
  fallback,
  onPreviewUpload
}: {
  uid?: string;
  url?: string;
  fallback?: string;
  onPreviewUpload: (f: File) => void;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(url);
  const [uploading, setUploading] = useState(false);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async e => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
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
      alert('Error uploading avatar!');
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={avatarUrl} key={avatarUrl} />
        <AvatarFallback>{fallback?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <Label
          htmlFor="avatar-upload"
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
        >
          <Upload className="h-4 w-4" />
          Загрузить фото
        </Label>
        <Input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadAvatar}
        />
      </div>
    </div>
  );
}
