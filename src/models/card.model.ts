import { Table, Column, Model, ForeignKey, BelongsTo, DataType, HasMany } from 'sequelize-typescript';
import { List } from './list.model';
import { Board } from './board.model';
import { Comment } from './comment.model';

@Table
export class Card extends Model {
  @Column({ allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT })
  declare description?: string;

  @Column({ type: DataType.ENUM('low', 'medium', 'high', 'urgent'), defaultValue: 'low' })
  declare priority: 'low' | 'medium' | 'high' | 'urgent';

  @Column({ type: DataType.JSON })
  declare tags: { name: string; color: string }[];

  @Column({ type: DataType.JSON })
  declare checklist: { text: string; completed: boolean }[];

  @Column(DataType.DATE)
  declare startDate?: Date;

  @Column(DataType.DATE)
  declare endDate?: Date;

  @ForeignKey(() => List)
  @Column
  declare listId: number;

  @ForeignKey(() => Board)
  @Column
  declare boardId: number;

  @BelongsTo(() => List)
  declare list: List;

  @BelongsTo(() => Board)
  declare board: Board;

  @HasMany(() => Comment)
  comments: Comment[];
}
