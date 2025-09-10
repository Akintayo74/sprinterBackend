import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Models
import { User } from './models/user.model';
import { Board } from './models/board.model';
import { BoardMember } from './models/board-member.model';
import { List } from './models/list.model';
import { Card } from './models/card.model';
import { Comment } from './models/comment.model';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';
import { ListModule } from './modules/list/list.module';
import { CardModule } from './modules/card/card.module';
import { CommentModule } from './modules/comment/comment.module';
import { VoiceNoteModule } from './modules/voice-note/voice-note.module';

// Strategies
import { JwtStrategy } from './common/strategies/jwt.strategy';

@Module({
  imports: [
    // Make env vars available everywhere
    ConfigModule.forRoot({ isGlobal: true }),

    // Sequelize setup
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'sqlite', // or 'postgres' if you’re switching later
        storage: config.get<string>('DATABASE_PATH') || './dev.sqlite',
        autoLoadModels: true,
        synchronize: true,
        models: [User, Board, BoardMember, List, Card, Comment],
        logging: console.log,
      }),
    }),

    // Auth
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '15m' },
      }),
    }),

    // Feature modules
    AuthModule,
    BoardModule,
    ListModule,
    CardModule,
    CommentModule,
    VoiceNoteModule
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
