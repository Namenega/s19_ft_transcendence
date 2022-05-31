import { ChannelsEntity } from "../entities/channels.entity";
import { OmitType } from "@nestjs/mapped-types";

export class CreateChannelDto extends OmitType(ChannelsEntity, ["id"]) {}
