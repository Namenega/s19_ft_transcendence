import { ChannelDto } from "./channel.dto";

export type CreateChannelDto = Omit<ChannelDto, "id">;