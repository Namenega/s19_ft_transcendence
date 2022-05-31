import { CreateChannelMessagesDto } from './createChannelMessages.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateChannelMessagesDto extends PartialType(CreateChannelMessagesDto) {}
