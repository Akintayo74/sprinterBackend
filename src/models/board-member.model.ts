import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Board } from './board.model';
import { User } from './user.model';

@Table
export class BoardMember extends Model {
  @ForeignKey(() => Board)
  @Column
  declare boardId: number;

  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @Column({
    type: DataType.ENUM('owner', 'admin', 'member'),
    defaultValue: 'member',
  })
  declare role: 'owner' | 'admin' | 'member';

  @BelongsTo(() => Board)
  declare board: Board;

  @BelongsTo(() => User)
  declare user: User;
}
