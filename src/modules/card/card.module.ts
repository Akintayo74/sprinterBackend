import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from 'src/models/card.model';
import { List } from 'src/models/list.model';
import { Comment } from 'src/models/comment.model';
import { User } from 'src/models/user.model';
import { BoardMember } from 'src/models/board-member.model';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
  imports: [SequelizeModule.forFeature([Card, List, BoardMember, Comment, User])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
