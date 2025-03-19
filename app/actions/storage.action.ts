'use server';

import { createClient } from '@supabase/supabase-js';

import { verifySessionAndGetId } from '../api/auth/utils';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const getAvatarUploadUrl = async (uid: string, fileName: string) => {
  const userId = await verifySessionAndGetId();
  if (userId !== uid) {
    throw new Error('User is not authorized to upload to this bucket');
  }
  const { data, error } = await adminSupabase.storage
    .from('avatar')
    .createSignedUploadUrl(`${uid}/${fileName}`, { upsert: true });
  if (error) {
    throw error;
  }
  console.log(`Issued new url for uploading: ${data}`);
  return data;
};

export const deleteCurrentAvatar = async (uid: string) => {
  try {
    const { data: list, error: listError } = await adminSupabase.storage
      .from('avatar')
      .list(`${uid}`);
    const filesToRemove = list?.map(x => `${uid}/${x.name}`);

    if (!filesToRemove) return;
    if (listError)
      throw new Error(`Error while deleting your files: ${listError.message}`);

    const { error } = await adminSupabase.storage
      .from('avatar')
      .remove(filesToRemove);

    if (error)
      throw new Error(`Error while deleting your files: ${error.message}`);
  } catch (e: any) {
    console.log(`Error occured while deleting: ${e.message}`);
  }
};
