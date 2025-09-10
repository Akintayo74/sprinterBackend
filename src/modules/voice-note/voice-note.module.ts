import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VoiceNote } from 'src/models/voice-note.model';
import { Card } from 'src/models/card.model';
import { BoardMember } from '../../models/board-member.model';
import { User } from 'src/models/user.model';
import { VoiceNoteService } from './voice-note.service';
import { VoiceNoteController } from './voice-note.controller';
// import { StorageService } from 'src/utils/storage.service';
import { SupabaseService } from 'src/utils/supabase.service';

@Module({
  imports: [SequelizeModule.forFeature([VoiceNote, Card, User, BoardMember])],
  providers: [VoiceNoteService, SupabaseService],
  controllers: [VoiceNoteController],
})
export class VoiceNoteModule {}
