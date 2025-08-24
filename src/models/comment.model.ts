import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Card } from './card.model';

@Table
export class Comment extends Model<Comment> {
  @Column
  content: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Card)
  @Column
  cardId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Card)
  card: Card;
}
