'use server';

import { createClient } from '@supabase/supabase-js';

import { verifySessionAndGetId } from '../api/auth/utils';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const getAvatarUploadUrl = async (userId: string, fileName: string) => {
  const actualUserId = await verifySessionAndGetId();
  if (actualUserId !== userId) {
    throw new Error('User is not authorized to upload to this bucket');
  }
  if (!fileName) throw new Error("fileName can't be empty");
  const { data, error } = await adminSupabase.storage
    .from('avatar')
    .createSignedUploadUrl(`${userId}/${fileName}`, { upsert: true });
  if (error) {
    throw error;
  }
  console.log(`Issued new url for uploading: ${data}`);
  return data;
};

export const deleteCurrentAvatar = async (userId: string) => {
  const actualUserId = await verifySessionAndGetId();
  if (actualUserId !== userId)
    throw new Error("User can't delete from foreign bucket");
  try {
    const { data: list, error: listError } = await adminSupabase.storage
      .from('avatar')
      .list(`${userId}`);
    const filesToRemove = list?.map(x => `${userId}/${x.name}`);

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
