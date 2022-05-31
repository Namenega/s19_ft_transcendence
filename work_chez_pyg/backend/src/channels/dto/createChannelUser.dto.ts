import { ChannelsUsersEntity } from "../entities/channelsUsers.entity";
import { OmitType } from "@nestjs/mapped-types";

export class CreateChannelUserDto extends OmitType(ChannelsUsersEntity, ["id"]) {}
