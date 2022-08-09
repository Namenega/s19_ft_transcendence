import { ChannelsMessagesEntity } from "../entities/channelsMessages.entity"
import { OmitType } from "@nestjs/mapped-types";

/* This class is used to create a new channel message */
export class CreateChannelMessagesDto extends OmitType(ChannelsMessagesEntity, ["id"]) {}
