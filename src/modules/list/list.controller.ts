import { Controller, Post, Get, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller()
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post('boards/:boardId/lists')
  async createList(
    @Req() req: Request & { user?: { id: number } },
    @Param('boardId') boardId: string,
    @Body() dto: CreateListDto,
  ) {
    return this.listService.createList(req.user!.id, +boardId, dto);
  }

  @Get('boards/:boardId/lists')
  async getLists(
    @Req() req: Request & { user?: { id: number } },
    @Param('boardId') boardId: string,
  ) {
    return this.listService.getLists(req.user!.id, +boardId);
  }
  
  @Patch('boards/:boardId/lists/:id')
  async updateList(
    @Req() req: Request & { user?: { id: number } },
    @Param('id') listId: string,
    @Body() dto: UpdateListDto,
  ) {
    return this.listService.updateList(req.user!.id, +listId, dto);
  }

  @Delete('boards/:boardId/lists/:id')
  async deleteList(
    @Req() req: Request & { user?: { id: number } },
    @Param('id') listId: string,
  ) {
    return this.listService.deleteList(req.user!.id, +listId);
  }

}
