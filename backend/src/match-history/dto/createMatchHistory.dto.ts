import { MatchHistory } from './entities/matchHistory.entity';
import { OmitType } from '@nestjs/mapped-types';

export class CreateMatchHistoryDto extends OmitType(MatchHistoryEntity, ["id"]) {}
