import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { BoardMember } from './board-member.model';

@Table
export class Board extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description: string;

  @HasMany(() => BoardMember)
  declare members: BoardMember[];
}
