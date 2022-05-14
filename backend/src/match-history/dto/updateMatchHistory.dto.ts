import { CreateMatchHistoryDto } from './createMatchHistory.dto'
import { PartialType } from '@nestjs/mapped-type'

export class updateMatchHistoryDto extends PartialType(CreateMatchHistory) {}
