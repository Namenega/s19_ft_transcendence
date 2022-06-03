import { CreateChannelUserDto } from './createChannelUser.dto';
import { PartialType } from "@nestjs/mapped-types";

/* This class is a partial of the CreateChannelUserDto class, and it's used to
update a channel user */
export class UpdateChannelUserDto extends PartialType(CreateChannelUserDto) {}
