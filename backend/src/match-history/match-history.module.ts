import { Module } from '@nestjs/common';
import { MatchHistoryController } from './match-history.controller';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryEntity } from './entities/matchHistory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

/* This class is a module that imports the TypeOrmModule and the
MatchHistoryEntity, and it also imports the MatchHistoryController and the
MatchHistoryService */
@Module({
  imports: [TypeOrmModule.forFeature([MatchHistoryEntity])],
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService]
})
export class MatchHistoryModule {}
