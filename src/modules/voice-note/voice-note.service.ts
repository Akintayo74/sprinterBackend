import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from '../../models/card.model';
import { BoardMember } from '../../models/board-member.model';
import { VoiceNote } from 'src/models/voice-note.model';
// import { StorageService } from 'src/utils/storage.service';
import { SupabaseService } from 'src/utils/supabase.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class VoiceNoteService {
  private readonly logger = new Logger(SupabaseService.name);

  constructor(
    @InjectModel(Card) private cardModel: typeof Card,
    @InjectModel(BoardMember) private boardMemberModel: typeof BoardMember,
    @InjectModel(VoiceNote) private voiceNoteRepo: typeof VoiceNote,
    private supabaseService: SupabaseService,
  ) {}

  async userHasAccess(cardId: number, userId: number): Promise<boolean> {
    const card = await this.cardModel.findByPk(cardId, { include: ['list'] });
    if (!card) return false;

    const boardId = card.list.boardId;
    const membership = await this.boardMemberModel.findOne({
      where: { boardId, userId },
    });

    return !!membership;
  }

  async create(userId: number, cardId: number, file: Express.Multer.File) {
    if (!file) throw new NotFoundException('File not provided');

    // Upload file to Supabase
    const path = await this.supabaseService.uploadVoiceNote(file, userId);
    // this.logger.debug(`Uploading to path: ${path}`);

    // Save DB record with Supabase path
    return this.voiceNoteRepo.create({ url: path, userId, cardId });
  }

  async findAll(cardId: number) {
    const notes = await this.voiceNoteRepo.findAll({
      where: { cardId },
      include: ['user'],
    });

    // this.logger.debug('Finding all notes', notes.filter((note, i) => note.dataValues.url));
    if (!notes) throw new NotFoundException('No voice notes found');

    // const jsonNotes = notes.map(note => {
    //   const noteUser = note?.user;
    //   const noteUserWithoutPassword = { ...noteUser };
    //   return { ...note.toJSON(), user: noteUserWithoutPassword };
    // });
    // this.logger.debug('Finding all notes2: ', jsonNotes);

    const withUrls = await Promise.all(
      notes.map(async (note) => {
        let url = note.url;

        // If URL is a Supabase path (doesn't start with http:// or https://)
        if (url && !url.startsWith('http')) {
          try {
            url = await this.supabaseService.getSignedUrl(url, 300); // 5 minutes
          } catch (err) {
            this.logger.error(`Failed to sign URL for ${url}: ${err.message}`);
          }
        }

        return { ...note.toJSON(), url };
      }),
    );

    return withUrls;
  }

  async remove(userId: number, id: number) {
    const note = await this.voiceNoteRepo.findByPk(id);
    if (!note) throw new NotFoundException('Voice note not found');
    if (note.userId !== userId) {
      throw new ForbiddenException('Not allowed to delete');
    }

    // remove file from Supabase storage
    await this.supabaseService.deleteVoiceNote(note.url);

    // remove DB record
    await note.destroy();

    return { message: 'Voice note deleted' };
  }

  // async remove(userId: number, id: number) {
  //   const note = await this.voiceNoteRepo.findByPk(id);
  //   if (!note) throw new NotFoundException('Voice note not found');
  //   if (note.userId !== userId)
  //     throw new ForbiddenException('Not allowed to delete');

  //   await note.destroy();
  //   return { message: 'Voice note deleted' };
  // }
}
