import { createClient } from '@supabase/supabase-js';
import { v4 as uuidV4 } from 'uuid';

import {
  deleteCurrentAvatar,
  getAvatarUploadUrl
} from '@/app/actions/storage.action';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const uploadAvatar = async (userId: string, file?: File) => {
  if (!file) throw Error('No file for uploading was provided!');

  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${uuidV4()}.${fileExt}`;

    await deleteCurrentAvatar(userId);
    const { path, token } = await getAvatarUploadUrl(userId, filePath);

    const { error: uploadError } = await supabase.storage
      .from('avatar')
      .uploadToSignedUrl(path, token, file, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('avatar').getPublicUrl(path);

    return data.publicUrl;
  } catch (error) {
    console.error('Ошибка загрузки фото');
  }
};

export const deleteAvatar = async (userId: string) => {
  await deleteCurrentAvatar(userId);
};
