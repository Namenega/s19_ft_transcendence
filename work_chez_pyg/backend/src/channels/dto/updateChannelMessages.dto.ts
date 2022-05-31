import { createChannelMessagesDto } from './createChannelMessages.dto';
import { Partialtype } from '@nestjs/mapped-types';

export class UpdateChannelMessagesDto extends PartialType(CreateChannelMessagesDto) {}
