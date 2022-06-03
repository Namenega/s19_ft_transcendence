import { CreateChannelMessagesDto } from './createChannelMessages.dto';
import { PartialType } from '@nestjs/mapped-types';

/* This class is a partial of the CreateChannelMessagesDto class, and it's used to
update a channel message */
export class UpdateChannelMessagesDto extends PartialType(CreateChannelMessagesDto) {}
