import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CardAccessGuard } from 'src/common/guards/card-access.guard';
import { CommentOwnerOrAdminGuard } from 'src/common/guards/comment-owner-or-admin.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('cards/:cardId/comment')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(CardAccessGuard)
  async create(@Param('cardId') cardId: number, @GetUser() user, @Body() dto: CreateCommentDto) {
    return this.commentService.create(user.id, +cardId, dto);
  }

  @Get()
  @UseGuards(CardAccessGuard)
  async findAll(@Param('cardId') cardId: number) {
    return this.commentService.findAll(+cardId);
  }

  @Patch(':id')
  @UseGuards(CommentOwnerOrAdminGuard)
  async update(@Param('id') id: number, @GetUser() user, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(user.id, +id, dto);
  }

  @Delete(':id')
  @UseGuards(CommentOwnerOrAdminGuard)
  async remove(@Param('id') id: number, @GetUser() user) {
    return this.commentService.remove(user.id, +id);
  }
}
