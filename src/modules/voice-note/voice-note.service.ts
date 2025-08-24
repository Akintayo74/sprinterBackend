import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VoiceNote } from 'src/models/voice-note.model';
// import { Multer } from 'multer';

@Injectable()
export class VoiceNoteService {
  constructor(@InjectModel(VoiceNote) private voiceNoteModel: typeof VoiceNote) {}
//   async uploadVoiceNote(file: Multer.File, cardId: number, userId: number) {
  async uploadVoiceNote(file: Express.Multer.File, cardId: number, userId: number) {
    if (!file) throw new BadRequestException('File is required');

    // Store the path (could later be cloud storage URL)
    const fileUrl = `uploads/${file.filename}`;

    const voiceNote = await this.voiceNoteModel.create({
      fileUrl,
      cardId,
      userId,
    } as any);

    return { message: 'Voice note uploaded', voiceNote };
  }

  async getVoiceNotesByCard(cardId: number) {
    return this.voiceNoteModel.findAll({ where: { cardId } });
  }
}
