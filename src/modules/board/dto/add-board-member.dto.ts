import { IsEmail, IsIn } from 'class-validator';

export class AddBoardMemberDto {
  @IsEmail()
  email: string;

  @IsIn(['admin', 'member'])
  role: 'admin' | 'member';
}
