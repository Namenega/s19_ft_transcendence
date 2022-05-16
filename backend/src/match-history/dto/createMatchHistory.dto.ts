import { OmitType } from '@nestjs/mapped-types';
import { MatchHistoryEntity } from '../entities/matchHistory.entity';

export class CreateMatchHistoryDto extends OmitType(MatchHistoryEntity, ["id"]) {}
