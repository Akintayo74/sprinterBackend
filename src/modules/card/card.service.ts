import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from 'src/models/card.model';
import { List } from 'src/models/list.model';
import { BoardMember } from 'src/models/board-member.model';
import { Comment } from 'src/models/comment.model';
import { User } from 'src/models/user.model';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card) private cardModel: typeof Card,
    @InjectModel(List) private listModel: typeof List,
    @InjectModel(BoardMember) private boardMemberModel: typeof BoardMember,
    @InjectModel(Comment) private commentModel: typeof Comment,
    @InjectModel(User) private userModel: typeof User, 
  ) {}

  async createCard(userId: number, listId: number, dto: CreateCardDto) {
    const list = await this.listModel.findByPk(listId);
    if (!list) throw new NotFoundException('List not found');

    const member = await this.boardMemberModel.findOne({
      where: { userId, boardId: list.boardId },
    });

    if (!member) throw new ForbiddenException('Not a board member');

    const card = await this.cardModel.create({
      ...dto,
      listId,
      boardId: list.boardId,
    });

    return { message: 'Card created', card };
  }

  async getCard(userId: number, cardId: number) {
    const card = await this.cardModel.findByPk(cardId);
    if (!card) throw new NotFoundException('Card not found');
    const member = await this.boardMemberModel.findOne({
      where: { userId, boardId: card.boardId },
    });
    if (!member) throw new ForbiddenException('Not a board member');
    return card;
  }

  async getCards(userId: number, listId: number) {
    const list = await this.listModel.findByPk(listId);
    if (!list) throw new NotFoundException('List not found');

    const member = await this.boardMemberModel.findOne({
      where: { userId, boardId: list.boardId },
    });
    if (!member) throw new ForbiddenException('Not a board member');

    return this.cardModel.findAll({ where: { listId } });
  }

  async updateCard(userId: number, cardId: number, dto: UpdateCardDto) {
    const card = await this.cardModel.findByPk(cardId);
    if (!card) throw new NotFoundException('Card not found');
    else console.log('Card found'); 
    console.log('Dto', dto)

    const member = await this.boardMemberModel.findOne({
      where: { userId, boardId: card.boardId },
    });
    if (!member) throw new ForbiddenException('Not a board member');

    await card.update(dto);
    return { message: 'Card updated', card };
  }

  async deleteCard(userId: number, cardId: number) {
    const card = await this.cardModel.findByPk(cardId);
    if (!card) throw new NotFoundException('Card not found');

    const member = await this.boardMemberModel.findOne({
      where: { userId, boardId: card.boardId },
    });
    if (!member) throw new ForbiddenException('Not a board member');

    await card.destroy();
    return { message: 'Card deleted' };
  }

  async updateChecklistItem(userId: number, cardId: number, dto: UpdateChecklistDto) {
    console.log("In update checklist item"); 

    const card = await this.cardModel.findByPk(cardId);
    if (!card) throw new NotFoundException('Card not found');

    const member = await this.boardMemberModel.findOne({
      where: { userId, boardId: card.boardId },
    });
    if (!member) throw new ForbiddenException('Not a board member');

    const checklist = Array.isArray(card.checklist) ? [...card.checklist] : [];

    if (dto.index < 0 || dto.index >= checklist.length) {
      throw new BadRequestException('Invalid checklist index');
    }

    checklist[dto.index] = {
      text: dto.text,
      completed: dto.completed,
    };

    card.checklist = checklist;
    await card.save();

    return { message: 'Checklist item updated', checklist };
  }

  async addChecklistItem(userId: number, cardId: number, text: string) {
    const card = await this.cardModel.findByPk(cardId);
    if (!card) throw new NotFoundException('Card not found');

    const member = await this.boardMemberModel.findOne({
      where: { userId, boardId: card.boardId },
    });
    if (!member) throw new ForbiddenException('Not a board member');

    const checklist = Array.isArray(card.checklist) ? [...card.checklist] : [];
    checklist.push({ text, completed: false });

    card.checklist = checklist;
    console.log("Added a checklist item", checklist); 
    await card.save();

    return { message: 'Checklist item added', checklist };
  }

  async deleteChecklistItem(userId: number, cardId: number, index: number) {
    const card = await this.cardModel.findByPk(cardId);
    if (!card) throw new NotFoundException('Card not found');

    const member = await this.boardMemberModel.findOne({
      where: { userId, boardId: card.boardId },
    });
    if (!member) throw new ForbiddenException('Not a board member');

    const checklist = Array.isArray(card.checklist) ? [...card.checklist] : [];
    if (index < 0 || index >= checklist.length) {
      throw new BadRequestException('Invalid checklist index');
    }

    checklist.splice(index, 1);

    card.checklist = checklist;
    await card.save();

    return { message: 'Checklist item deleted', checklist };
  }

  async addComment(userId: number, cardId: number, dto: CreateCommentDto) {
    const card = await this.cardModel.findByPk(cardId);
    if (!card) throw new NotFoundException('Card not found');

    const member = await this.boardMemberModel.findOne({
      where: { userId, boardId: card.boardId },
    });
    if (!member) throw new ForbiddenException('Not a board member');

    const comment = await this.commentModel.create({
      content: dto.content,
      userId,
      cardId,
    } as any);

    return { message: 'Comment added', comment };
  }

  async getComments(userId: number, cardId: number) {
    const card = await this.cardModel.findByPk(cardId);
    if (!card) throw new NotFoundException('Card not found');

    const member = await this.boardMemberModel.findOne({
      where: { userId, boardId: card.boardId },
    });
    if (!member) throw new ForbiddenException('Not a board member');

    return this.commentModel.findAll({
      where: { cardId },
      include: [{ model: this.userModel, attributes: ['id', 'email', 'firstName', 'lastName'] }],
      order: [['createdAt', 'ASC']],
    });
  }

  async updateComment(userId: number, commentId: number, dto: CreateCommentDto) {
    const comment = await this.commentModel.findByPk(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException(`Not allowed, ${comment.content}, ${userId}`);

    comment.content = dto.content;
    await comment.save();
    return comment;
  }

  
  async remove(userId: number, commentId: number) {
    const comment = await this.commentModel.findByPk(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Not allowed');

    await comment.destroy();
    return { message: 'Comment deleted' };
  }

}