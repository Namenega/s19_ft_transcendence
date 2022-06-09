import { DmMessageDto } from "./dm_message.dto";

export type CreateDmMessageDto = Omit<DmMessageDto, "id">;