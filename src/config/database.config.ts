import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './dev.sqlite',
  models: [User],
  logging: false,
});
