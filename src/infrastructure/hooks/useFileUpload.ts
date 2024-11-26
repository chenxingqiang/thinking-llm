import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (
    bucket: string,
    path: string,
    file: File
  ): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (
    bucket: string,
    path: string
  ): Promise<boolean> => {
    try {
      setError(null);
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (deleteError) {
        throw deleteError;
      }

      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    error,
  };
}; 