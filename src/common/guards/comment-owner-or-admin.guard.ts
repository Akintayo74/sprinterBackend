import {
  CanActivate, ExecutionContext, Injectable, ForbiddenException, NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from 'src/models/comment.model';
import { Card } from 'src/models/card.model';
import { List } from 'src/models/list.model';
import { BoardMember } from 'src/models/board-member.model';

@Injectable()
export class CommentOwnerOrAdminGuard implements CanActivate {
  constructor(
    @InjectModel(Comment) private readonly commentRepo: typeof Comment,
    @InjectModel(Card) private readonly cardRepo: typeof Card,
    @InjectModel(List) private readonly listRepo: typeof List,
    @InjectModel(BoardMember) private readonly bmRepo: typeof BoardMember,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<{ params: any; user?: { id: number } }>();
    const userId = req.user?.id;
    const commentId = Number(req.params.id);

    if (!userId || !commentId) throw new ForbiddenException('Missing user or comment');

    const comment = await this.commentRepo.findByPk(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId === userId) return true; // author

    // Else must be board owner/admin
    const card = await this.cardRepo.findByPk(comment.cardId, {
      include: [{ model: List, attributes: ['id', 'boardId'] }],
    });
    if (!card) throw new NotFoundException('Card not found');

    // @ts-ignore
    const boardId: number | undefined = card.list?.getDataValue('boardId') ?? card['boardId'];
    if (!boardId) throw new NotFoundException('List/Board not found');

    const membership = await this.bmRepo.findOne({ where: { boardId, userId } });
    if (!membership) throw new ForbiddenException('Not a board member');
    if (!['owner', 'admin'].includes(String(membership.role))) {
      throw new ForbiddenException('Must be owner/admin');
    }

    return true;
    }
}
