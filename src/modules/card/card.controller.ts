import { Body, Controller, Delete, Param, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Request } from 'express';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { CreateCommentDto } from '../board/dto/create-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class CardController {
  constructor(private readonly cardService: CardService) {}

    @Post('lists/:listId/cards')
    async createCard(
        @Req() req: Request & { user?: { id: number } },
        @Param('listId') listId: string,
        @Body() dto: CreateCardDto,
    ) {
        return this.cardService.createCard(req.user!.id, +listId, dto);
    }

    @Get('lists/:listId/cards/:id')
    async getCard(
        @Req() req: Request & { user?: { id: number } },
        @Param('id') cardId: string,
    ) {
        return this.cardService.getCard(req.user!.id, +cardId);
    }

    @Get('lists/:listId/cards')
    async getCards(
        @Req() req: Request & { user?: { id: number } },
        @Param('listId') listId: string,
    ) {
        return this.cardService.getCards(req.user!.id, +listId);
    }

    @Patch('lists/:listId/cards/:id')
    async updateCard(
        @Req() req: Request & { user?: { id: number } },
        @Param('id') cardId: string,
        @Body() dto: UpdateCardDto,
    ) {
        console.log('dto from controller', dto);
        return this.cardService.updateCard(req.user!.id, +cardId, dto);
    }

    @Delete('lists/:listId/cards/:id')
    async deleteCard(
        @Req() req: Request & { user?: { id: number } },
        @Param('id') cardId: string,
    ) {
        return this.cardService.deleteCard(req.user!.id, +cardId);
    }

    @Post('cards/:cardId/checklist')
    async addChecklistItem(
    @Req() req: Request & { user?: { id: number } },
    @Param('cardId') cardId: string,
    @Body('text') text: string,
    ) {
    return this.cardService.addChecklistItem(req.user!.id, +cardId, text);
    }

    @Patch('cards/:cardId/checklist')
    async updateChecklistItem(
    @Req() req: Request & { user?: { id: number } },
    @Param('cardId') cardId: string,
    @Body() dto: UpdateChecklistDto,
    ) {
    return this.cardService.updateChecklistItem(req.user!.id, +cardId, dto);
    }

    @Delete('cards/:cardId/checklist/:index')
    async deleteChecklistItem(
    @Req() req: Request & { user?: { id: number } },
    @Param('cardId') cardId: string,
    @Param('index') index: string,
    ) {
    return this.cardService.deleteChecklistItem(req.user!.id, +cardId, +index);
    }

    @Post('cards/:cardId/comments')
    async addComment(
    @Req() req: Request & { user?: { id: number } },
    @Param('cardId') cardId: string,
    @Body() dto: CreateCommentDto,
    ) {
    return this.cardService.addComment(req.user!.id, +cardId, dto);
    }

    @Get('cards/:cardId/comments')
    async getComments(
    @Req() req: Request & { user?: { id: number } },
    @Param('cardId') cardId: string,
    ) {
    return this.cardService.getComments(req.user!.id, +cardId);
    }

}