import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { User } from './models/user.model';
import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';
import { ListModule } from './modules/list/list.module'; 
import { CardModule } from './modules/card/card.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: './dev.sqlite',
      models: [User],
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([User]),
    MulterModule.register({
      dest: './uploads', // local folder for uploads
    }),
    AuthModule,
    BoardModule,
    ListModule, 
    CardModule,
  ],
})
export class AppModule {}
