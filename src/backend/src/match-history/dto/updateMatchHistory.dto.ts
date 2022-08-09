import { CreateMatchHistoryDto } from './createMatchHistory.dto'
import { PartialType } from '@nestjs/mapped-types'

/* This class is a partial of the CreateMatchHistoryDto class, which means it has
all the same properties as the CreateMatchHistoryDto class, but it's not
required to have all of them */
export class UpdateMatchHistoryDto extends PartialType(CreateMatchHistoryDto) {}
