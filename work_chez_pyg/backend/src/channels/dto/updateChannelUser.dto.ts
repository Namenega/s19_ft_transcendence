import { CreateChannelUserDto } from './createChannelUser.dto';
import { PartialType } from "@nestjs/mapped-types";

export class UpdateChannelUserDto extends PartialType(CreateChannelUserDto) {}
