import { DmDto } from "./dm.dto"
import { UserDto } from "../../user/dto/user.dto"

export interface DmMessageDto {
  id: number
  user: UserDto
  dm: DmDto
  content: string
  order: number
}