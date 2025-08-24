import { Injectable, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { List } from 'src/models/list.model';
import { BoardMember } from 'src/models/board-member.model';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List) private listModel: typeof List,
    @InjectModel(BoardMember) private boardMemberModel: typeof BoardMember,
  ) {}

  async createList(userId: number, boardId: number, dto: CreateListDto) {
    const member = await this.boardMemberModel.findOne({ where: { boardId, userId } });
    if (!member) throw new ForbiddenException('Not a board member');

    const list = await this.listModel.create({ title: dto.title, boardId });
    return { message: 'List created', list };
  }

  async getLists(userId: number, boardId: number) {
    const member = await this.boardMemberModel.findOne({ where: { boardId, userId } });
    if (!member) throw new ForbiddenException('Not a board member');

    return await this.listModel.findAll({ where: { boardId } });
  }

  async updateList(userId: number, listId: number, dto: UpdateListDto) {
  const list = await this.listModel.findByPk(listId);
  if (!list) throw new NotFoundException('List not found');

  const member = await this.boardMemberModel.findOne({
    where: { userId, boardId: list.boardId },
  });

  if (!member || member.role === 'member') {
    throw new ForbiddenException('Only owner or admin can update list');
  }

  await list.update({ title: dto.title ?? list.title });
  return { message: 'List updated successfully' };
}

async deleteList(userId: number, listId: number) {
  const list = await this.listModel.findByPk(listId);
  if (!list) throw new NotFoundException('List not found');

  const member = await this.boardMemberModel.findOne({
    where: { userId, boardId: list.boardId },
  });

  if (!member || member.role === 'member') {
    throw new ForbiddenException('Only owner or admin can delete list');
  }

  await list.destroy();
  return { message: 'List deleted successfully' };
}

}
