import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from './user.model';
import { Card } from './card.model';

@Table
export class VoiceNote extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare url: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => Card)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare cardId: number;

  @BelongsTo(() => Card)
  declare card?: Card;
}


// import {
//   Table, Column, Model, ForeignKey, BelongsTo,
// } from 'sequelize-typescript';
// import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
// import { User } from './user.model';
// import { Card } from './card.model';

// @Table
// export class VoiceNote extends Model<
//   InferAttributes<VoiceNote>,
//   InferCreationAttributes<VoiceNote>
// > {
//   @Column
//   declare id: CreationOptional<number>;

//   @Column
//   declare url: string;  // File path or external URL

//   @ForeignKey(() => User)
//   @Column
//   declare userId: number;

//   @BelongsTo(() => User)
//   declare user?: User;

//   @ForeignKey(() => Card)
//   @Column
//   declare cardId: number;

//   @BelongsTo(() => Card)
//   declare card?: Card;
// }
