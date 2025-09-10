import {
  CanActivate, ExecutionContext, Injectable, ForbiddenException, NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from 'src/models/card.model';
import { List } from 'src/models/list.model';
import { BoardMember } from 'src/models/board-member.model';

@Injectable()
export class CardAccessGuard implements CanActivate {
  constructor(
    @InjectModel(Card) private readonly cardRepo: typeof Card,
    @InjectModel(List) private readonly listRepo: typeof List,
    @InjectModel(BoardMember) private readonly bmRepo: typeof BoardMember,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<{ params: any; user?: { id: number } }>();
    const userId = req.user?.id;
    const cardId = Number(req.params.cardId ?? req.params.id);

    if (!userId || !cardId) throw new ForbiddenException('Missing user or card');

    // Card -> List -> boardId
    const card = await this.cardRepo.findByPk(cardId, {
      include: [{ model: List, attributes: ['id', 'boardId'] }],
    });
    if (!card) throw new NotFoundException('Card not found');

    // @ts-ignore - depending on your associations, card.list may be present
    const boardId: number | undefined = card.list?.getDataValue('boardId') ?? card['boardId'];
    if (!boardId) throw new NotFoundException('List/Board not found');

    const membership = await this.bmRepo.findOne({ where: { boardId, userId } });
    if (!membership) throw new ForbiddenException('Not a board member');

    return true;
  }
}
