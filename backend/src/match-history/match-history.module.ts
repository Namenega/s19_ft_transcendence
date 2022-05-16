import { Module } from '@nestjs/common';
import { MatchHistoryController } from './match-history.controller';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryEntity } from './entities/matchHistory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MatchHistoryEntity])],
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService]
})
export class MatchHistoryModule {}
