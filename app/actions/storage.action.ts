'use server';

import { createClient } from '@supabase/supabase-js';
import { getTranslations } from 'next-intl/server';

import { getContextUserId, withAuth } from '@/lib/auth-wrapper';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const getAvatarUploadUrlAction = async (
  userId: string,
  fileName: string
) => {
  const t = await getTranslations('storage.errors');
  const actualUserId = getContextUserId();
  if (actualUserId !== userId) {
    throw new Error(t('cannotUseForeignBucket'));
  }
  if (!fileName) throw new Error(t('emptyFileName'));
  const { data, error } = await adminSupabase.storage
    .from('avatar')
    .createSignedUploadUrl(`${userId}/${fileName}`, { upsert: true });
  if (error) {
    throw error;
  }
  console.log(`Issued new url for uploading: ${data}`);
  return data;
};

export const deleteCurrentAvatarAction = async (userId: string) => {
  const t = await getTranslations('storage.errors');
  const actualUserId = getContextUserId();
  if (actualUserId !== userId) throw new Error(t('cannotUseForeignBucket'));
  const { data: list, error: listError } = await adminSupabase.storage
    .from('avatar')
    .list(`${userId}`);
  if (listError)
    throw new Error(`Error while deleting files: ${listError.message}`);
  const filesToRemove = list?.map(x => `${userId}/${x.name}`);
  if (!filesToRemove || filesToRemove.length === 0) return;

  const { error } = await adminSupabase.storage
    .from('avatar')
    .remove(filesToRemove);

  if (error)
    throw new Error(`Error while deleting your files: ${error.message}`);
};

export const getAvatarUploadUrl = withAuth(getAvatarUploadUrlAction);
export const deleteCurrentAvatar = withAuth(deleteCurrentAvatarAction);
