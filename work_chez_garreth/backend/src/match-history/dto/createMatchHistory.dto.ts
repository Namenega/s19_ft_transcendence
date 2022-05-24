import { OmitType } from '@nestjs/mapped-types';
import { MatchHistoryEntity } from '../entities/matchHistory.entity';

/* This class is used to create a new match history */
export class CreateMatchHistoryDto extends OmitType(MatchHistoryEntity, ["id"]) {}
