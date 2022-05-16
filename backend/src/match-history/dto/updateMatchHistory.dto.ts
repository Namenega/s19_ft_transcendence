import { CreateMatchHistoryDto } from './createMatchHistory.dto'
import { PartialType } from '@nestjs/mapped-types'

export class UpdateMatchHistoryDto extends PartialType(CreateMatchHistoryDto) {}
