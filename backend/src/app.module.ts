import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { MatchHistoryService } from './match-history/match-history.service';
import { MatchHistoryModule } from './match-history/match-history.module';
import { MatchHistoryController } from './match-history/match-history.controller';

@Module({
  imports: [UsersModule, MatchHistoryModule],
  controllers: [UsersController, MatchHistoryController],
  providers: [UsersService, MatchHistoryService],
})
export class AppModule { }
