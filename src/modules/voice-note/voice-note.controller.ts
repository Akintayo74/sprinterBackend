import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Body, Req, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceNoteService } from './voice-note.service';
import { UploadVoiceNoteDto } from './dto/upload-voice-note.dto';

@Controller('voice-notes')
@UseGuards(JwtAuthGuard)
export class VoiceNoteController {
  constructor(private readonly voiceNoteService: VoiceNoteService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVoiceNote(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadVoiceNoteDto,
    @Req() req,
  ) {
    return this.voiceNoteService.uploadVoiceNote(file, dto.cardId, req.user.id);
  }

  @Get('card/:cardId')
  async getVoiceNotes(@Param('cardId') cardId: number) {
    return this.voiceNoteService.getVoiceNotesByCard(cardId);
  }
}
