import { ChannelDto } from "./channel.dto"
import { UserDto } from "../../user/dto/user.dto"

export interface ChannelMessageDto {
  id: number
  channel: ChannelDto
  user: UserDto
  content: string
  order: number
}