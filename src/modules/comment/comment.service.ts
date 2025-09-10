import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from 'src/models/comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private commentModel: typeof Comment,
  ) {}

  async create(userId: number, cardId: number, dto: CreateCommentDto) {
    return this.commentModel.create({ ...dto, userId, cardId } as any);
  }

  async findAll(cardId: number) {
    return this.commentModel.findAll({
      where: { cardId },
    // fetch author info with selected attributes
    include: [{ association: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }],
      order: [['createdAt', 'ASC']],
    });
  }

  async update(userId: number, commentId: number, dto: UpdateCommentDto) {
    const comment = await this.commentModel.findByPk(commentId);
    if (!comment) throw new NotFoundException("Comment not found");
    if (comment.userId !== userId) throw new ForbiddenException("Not allowed");

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
