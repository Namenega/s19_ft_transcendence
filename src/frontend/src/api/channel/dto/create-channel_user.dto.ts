import { ChannelUserDto } from "./channel_user.dto";

export type CreateChannelUserDto = Omit<ChannelUserDto, "id">;