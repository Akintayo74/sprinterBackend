import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from 'src/models/comment.model';
import { Card } from 'src/models/card.model';
import { List } from 'src/models/list.model';
import { BoardMember } from 'src/models/board-member.model';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CardAccessGuard } from 'src/common/guards/card-access.guard';
import { CommentOwnerOrAdminGuard } from 'src/common/guards/comment-owner-or-admin.guard';

@Module({
  imports: [SequelizeModule.forFeature([Comment, Card, List, BoardMember])],
  providers: [CommentService, CardAccessGuard, CommentOwnerOrAdminGuard],
  controllers: [CommentController],
})
export class CommentModule {}
