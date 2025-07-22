import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Board } from 'src/models/board.model';
import { BoardMember } from 'src/models/board-member.model';
import { User } from 'src/models/user.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AddBoardMemberDto } from './dto/add-board-member.dto'; 

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board) private boardModel: typeof Board,
    @InjectModel(BoardMember) private boardMemberModel: typeof BoardMember,
    @InjectModel(User) private userModel: typeof User, 
  ) {}

  async createBoard(userId: number, dto: CreateBoardDto) {
    const board = await this.boardModel.create({
      title: dto.title,
      description: dto.description,
    });

    await this.boardMemberModel.create({
      boardId: board.id,
      userId,
      role: 'owner',
    });

    return {
      message: 'Board created successfully',
      board: {
        id: board.id,
        title: board.title,
        description: board.description,
    }};
  }

  async getBoardsForUser(userId: number) {
      const boardLinks = await this.boardMemberModel.findAll({
          where: { userId },
          include: [Board],
        });

        console.log("In getBoardsForUser", boardLinks)

        return boardLinks.map(link => ({
            id: link.board.id,
            title: link.board.title,
            description: link.board.description,
            role: link.role,
        }));
    }
    
  async getBoardById(userId: number, boardId: number) {
    const membership = await this.boardMemberModel.findOne({
        where: { userId, boardId },
        include: [Board],
    });
  
    if (!membership) throw new ForbiddenException('Not a board member');
  
    const board = membership.board;
  
    return {
        id: board.id,
        title: board.title,
        description: board.description,
        role: membership.role,
    };
  }
  
  async updateBoard(userId: number, boardId: number, dto: UpdateBoardDto) {
    const membership = await this.boardMemberModel.findOne({
      where: { userId, boardId },
      include: [Board],
    });
  
    if (!membership) throw new ForbiddenException('Not a board member');
    if (membership.role === 'member')
      throw new ForbiddenException('Only owner or admin can edit board');
  
    await membership.board.update({
      title: dto.title ?? membership.board.title,
      description: dto.description ?? membership.board.description,
    });
  
    return { message: 'Board updated successfully' };
  }
  
  async deleteBoard(userId: number, boardId: number) {
    const membership = await this.boardMemberModel.findOne({
      where: { userId, boardId },
      include: [Board],
    });
  
    if (!membership) throw new ForbiddenException('Not a board member');
    if (membership.role !== 'owner')
      throw new ForbiddenException('Only board owner can delete');
  
    await membership.board.destroy();
  
    return { message: 'Board deleted successfully' };
}

  async addMember(userId: number, boardId: number, dto: AddBoardMemberDto) {
    const requester = await this.boardMemberModel.findOne({ where: { userId, boardId } });
    if (!requester || requester.role === 'member') {
      throw new ForbiddenException('Only owner or admin can add members');
    }
    
    const userToAdd = await this.userModel.findOne({ where: { email: dto.email } });
    if (!userToAdd) throw new BadRequestException('User not found');
    
    const existing = await this.boardMemberModel.findOne({ where: { boardId, userId: userToAdd.id } });
    if (existing) throw new BadRequestException('User already a member');
    
    await this.boardMemberModel.create({
      boardId,
      userId: userToAdd.id,
      role: dto.role,
    });
    
    return { message: 'Member added successfully' };
    }

  async getBoardMembers(userId: number, boardId: number) {
    const requester = await this.boardMemberModel.findOne({ where: { userId, boardId } });
    if (!requester) throw new ForbiddenException('Access denied');
  
    const members = await this.boardMemberModel.findAll({
      where: { boardId },
      include: [User],
    });
  
    return members.map(m => ({
      id: m.user.id,
      email: m.user.email,
      name: `${m.user.firstName ?? ''} ${m.user.lastName ?? ''}`.trim(),
      role: m.role,
    }));
  }

  async removeMember(userId: number, boardId: number, targetUserId: number) {
    const requester = await this.boardMemberModel.findOne({ where: { userId, boardId } });
    if (!requester || requester.role === 'member') {
      throw new ForbiddenException('Only owner/admin can remove members');
    }
  
    const target = await this.boardMemberModel.findOne({ where: { boardId, userId: targetUserId } });
    if (!target) throw new BadRequestException('User not a member');
  
    if (target.role === 'owner') {
      throw new ForbiddenException('Owner cannot be removed');
    }
  
    await target.destroy();
    return { message: 'Member removed successfully' };
  }
  
  async updateMemberRole(userId: number, boardId: number, targetUserId: number, role: 'admin' | 'member') {
    const requester = await this.boardMemberModel.findOne({ where: { userId, boardId } });
    if (!requester || requester.role !== 'owner') {
      throw new ForbiddenException('Only owner can change roles');
    }
  
    const member = await this.boardMemberModel.findOne({ where: { boardId, userId: targetUserId } });
    if (!member) throw new BadRequestException('User not a member');
    if (member.role === 'owner') throw new ForbiddenException('Cannot change owner role');
        
  
    await member.update({ role });
    return { message: 'Member role updated successfully' };
  }

}
