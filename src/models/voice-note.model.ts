import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Card } from './card.model';
import { User } from './user.model';

@Table
export class VoiceNote extends Model<VoiceNote> {
  @Column({ type: DataType.STRING, allowNull: false })
  fileUrl: string; // path or cloud storage URL

  @ForeignKey(() => Card)
  @Column({ type: DataType.INTEGER })
  cardId: number;

  @BelongsTo(() => Card)
  card: Card;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
