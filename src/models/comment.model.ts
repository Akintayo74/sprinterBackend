// src/models/comment.model.ts
import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { User } from './user.model';
import { Card } from './card.model';

@Table
export class Comment extends Model<
  InferAttributes<Comment>,
  InferCreationAttributes<Comment>
> {
  @Column
  declare content: string;

  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => Card)
  @Column
  declare cardId: number;

  @BelongsTo(() => Card)
  declare card: Card;
}
