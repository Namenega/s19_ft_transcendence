import { CreateChannelDto } from './createChannel.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
