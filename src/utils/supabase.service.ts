import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
      throw new Error('Supabase URL or Service Key is not defined in environment variables.');
    }

    this.supabase = createClient(url, key);
  }

  async uploadVoiceNote(file: Express.Multer.File, userId: number): Promise<string> {
    const filePath = `voicenotes/${userId}-${Date.now()}-${file.originalname}`;

    const { error } = await this.supabase.storage
      .from('voice-notes') // bucket name
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw new Error(`Supabase upload error: ${error.message}`);
    return filePath; // only return path, not public URL
  }

  async getSignedUrl(path: string, expiresIn = 60): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from('voice-notes')
      .createSignedUrl(path, expiresIn);

    if (error) throw new Error(`Supabase signed URL error: ${error.message}`);
    return data.signedUrl;
  }

  async deleteVoiceNote(filePath: string): Promise<void> {
  const { error } = await this.supabase
    .storage
    .from('voice-notes')
    .remove([filePath]); // filePath should be like "voicenotes/filename.mp3"

  if (error) {
    // this.logger.error('Supabase delete error:', error.message);
    throw new Error(`Supabase delete error: ${error.message}`);
  }
}

}
