import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { List } from 'src/models/list.model';
import { BoardMember } from 'src/models/board-member.model';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [SequelizeModule.forFeature([List, BoardMember])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
