import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Board } from '../../models/board.model';
import { BoardMember } from '../../models/board-member.model'; 
import { User } from 'src/models/user.model';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [SequelizeModule.forFeature([Board, BoardMember, User])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
