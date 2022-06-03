import { ChannelsUsersEntity } from "../entities/channelsUsers.entity";
import { OmitType } from "@nestjs/mapped-types";

/* This class is used to create a new channel user */
export class CreateChannelUserDto extends OmitType(ChannelsUsersEntity, ["id"]) {}
