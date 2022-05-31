import { ChannelsMessagesEntity } from "../entities/channelsMessages.entity"
import { OmitType } from "@nestjs/mapped-types";

export class CreateChannelMessagesDto extends OmitType(ChannelsMessagesEntity, ["id"]) {}
