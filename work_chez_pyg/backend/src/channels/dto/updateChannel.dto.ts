import { CreateChannelDto } from './createChannel.dto';
import { PartialType } from '@nestjs/mapped-types';

/* The UpdateChannelDto class extends the CreateChannelDto class, and it's a
partial class */
export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
