import { ChannelMessageDto } from "./channel_message.dto"
import { ChannelUserDto } from "./channel_user.dto"
import { UserDto } from "../../user/dto/user.dto"

export interface ChannelDto {
  id: number
  users: UserDto[]
  messages: ChannelMessageDto[]
  channel_users: ChannelUserDto[]
  type: string
  password: string
  name: string
}