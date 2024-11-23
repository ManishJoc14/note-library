import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'https://zduohwulyilqfngqumyt.supabase.co';
// const supabaseKey =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkdW9od3VseWlscWZuZ3F1bXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NzQ2OTIsImV4cCI6MjA0NjM1MDY5Mn0.5femTvuWDJjJbK7OMpJgBSQ8vTNuUc78B9pwDdaK67c';


const supabaseUrl = 'https://scoxjeudnbppryqgcdof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb3hqZXVkbmJwcHJ5cWdjZG9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjEyMTQ3MCwiZXhwIjoyMDQ3Njk3NDcwfQ.e1jAvKB0-ij9Puz9f8ySYKw1PQoW7-N-dQXqb-UqwSY'; 

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadFile = async (file: File, path: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    // First try to upload to the existing bucket
    let { data, error } = await supabase.storage
      .from('notes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    // If that fails, try the admin-upload bucket
    if (error) {
      ({ data, error } = await supabase.storage
        .from('admin-upload')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        }));
    }

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
};

export const getFileUrl = (path: string) => {
  try {
    // Try to get URL from notes bucket first
    let { data } = supabase.storage.from('notes').getPublicUrl(path);
    
    // If that fails, try the admin-upload bucket
    if (!data.publicUrl) {
      ({ data } = supabase.storage.from('admin-upload').getPublicUrl(path));
    }

    if (!data.publicUrl) {
      throw new Error('File not found');
    }

    return data.publicUrl;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw new Error('Failed to get file URL');
  }
};