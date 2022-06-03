import { ChannelsEntity } from "../entities/channels.entity";
import { OmitType } from "@nestjs/mapped-types";

/* CreateChannelDto is a class that extends the ChannelsEntity class, but omits the
id property */
export class CreateChannelDto extends OmitType(ChannelsEntity, ["id"]) {}
