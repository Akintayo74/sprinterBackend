// upload-voice-note.dto.ts
import { IsNotEmpty } from 'class-validator';

export class UploadVoiceNoteDto {
  @IsNotEmpty()
  cardId: number;
}
