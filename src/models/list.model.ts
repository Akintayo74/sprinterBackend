import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Board } from './board.model';

@Table
export class List extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @ForeignKey(() => Board)
  @Column
  declare boardId: number;

  @BelongsTo(() => Board)
  declare board: Board;
}
