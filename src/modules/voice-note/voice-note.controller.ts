import * as fs from 'fs';
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Res,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { memoryStorage } from 'multer';
import { VoiceNoteService } from './voice-note.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
// import { StorageService } from 'src/utils/storage.service';
import { Response, Request } from 'express';
import { extname, join } from 'path';

@Controller('cards/:cardId/voice-notes')
@UseGuards(JwtAuthGuard)
export class VoiceNoteController {
  constructor(
    private voiceNoteService: VoiceNoteService,
    // private storage: StorageService,
  ) {}


  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // keep in memory, don’t write to disk
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
    }),
  )
  create(
    @GetUser() user: { id: number },
    @Param('cardId') cardId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.voiceNoteService.create(user.id, +cardId, file);
  }

  // @Post()
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: (req, file, cb) => cb(null, 'uploads/voicenotes'),
  //       filename: (req, file, cb) => {
  //         const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         cb(null, unique + extname(file.originalname));
  //       },
  //     }),
  //   }),
  // )
  // create(
  //   @GetUser() user: { id: number },
  //   @Param('cardId') cardId: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return this.voiceNoteService.create(user.id, +cardId, file);
  // }

  @Get()
  findAll(@Param('cardId') cardId: number) {
    return this.voiceNoteService.findAll(+cardId);
  }

  @Delete(':id')
  remove(@GetUser() user: { id: number }, @Param('id') id: number) {
    return this.voiceNoteService.remove(user.id, +id);
  }

  @Get(':filename')
  async streamVoiceNote(
    @Param('cardId') cardId: string,
    @Param('filename') filename: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req as any).user.id;

    // Verify that user has access to the card
    const canAccess = await this.voiceNoteService.userHasAccess(
      +cardId,
      userId,
    );
    if (!canAccess)
      throw new ForbiddenException('You do not have access to this card');

    try {
      // return this.voiceNoteService.streamVoiceNote(filename, req, res);
      const filePath = join(
        __dirname,
        '..',
        '..',
        'uploads',
        'voicenotes',
        filename,
      );
      const stat = fs.statSync(filePath);

      const range = req.headers.range;
      if (!range) {
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'audio/mpeg');
        fs.createReadStream(filePath).pipe(res);
      } else {
        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : stat.size - 1;

        const chunkSize = end - start + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'audio/mpeg',
        });

        fileStream.pipe(res);
      }
    } catch (e) {
      throw new NotFoundException('Voice note not found');
    }
  }
}
