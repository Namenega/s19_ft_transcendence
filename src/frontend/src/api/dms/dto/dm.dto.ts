import { DmMessageDto } from "./dm_message.dto"
import { UserDto } from "../../user/dto/user.dto"

export interface DmDto {
  id: number
  users: UserDto[]
  messages: DmMessageDto[]
  block: boolean
  blockerUserId: number
}