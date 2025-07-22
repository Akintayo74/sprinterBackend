import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AddBoardMemberDto } from './dto/add-board-member.dto'; 
import { Request } from 'express';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(
    @Req() req: Request & { user?: { id: number } },
    @Body() dto: CreateBoardDto,
  ) {
    if (!req.user) throw new Error('User not found in request');
    return this.boardService.createBoard(req.user!.id, dto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getBoards(@Req() req: Request & { user?: { id: number } }) {
    console.log("user", req.user)
    return this.boardService.getBoardsForUser(req.user!.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getBoardById(
    @Req() req: Request & { user?: { id: number } },
    @Param('id') id: string,
  ) {
    return this.boardService.getBoardById(req.user!.id, +id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateBoard(
    @Req() req: Request & { user?: { id: number } },
    @Param('id') id: string,
    @Body() dto: UpdateBoardDto,
  ) {
      return this.boardService.updateBoard(req.user!.id, +id, dto);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteBoard(
      @Req() req: Request & { user?: { id: number } },
      @Param('id') id: string,
    ) {
      return this.boardService.deleteBoard(req.user!.id, +id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/members')
    async addMember(
      @Req() req: Request & { user: { id: number } },
      @Param('id') boardId: string,
      @Body() dto: AddBoardMemberDto,
    ) {
        return this.boardService.addMember(req.user.id, +boardId, dto);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':id/members')
    async getMembers(
      @Req() req: Request & { user: { id: number } },
      @Param('id') boardId: string,
    ) {
      return this.boardService.getBoardMembers(req.user.id, +boardId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':id/members/:uid')
    async removeMember(
      @Req() req: Request & { user: { id: number } },
      @Param('id') boardId: string,
      @Param('uid') userIdToRemove: string,
    ) {
      return this.boardService.removeMember(req.user.id, +boardId, +userIdToRemove);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch(':id/members/:uid')
  async updateMemberRole(
    @Req() req: Request & { user: { id: number } },
    @Param('id') boardId: string,
    @Param('uid') targetUserId: string,
    @Body('role') role: 'admin' | 'member',
  ) {
    return this.boardService.updateMemberRole(req.user.id, +boardId, +targetUserId, role);
  }


}
