import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessageEntity } from './entities/directMessage.entity';
import { DirectMessageListEntity } from './entities/directMessageList.entity';

@Injectable()
export class DirectMessageService {
	constructor(
		@InjectRepository(DirectMessageEntity)
		private dm: Repository<DirectMessageEntity>,
		@InjectRepository(DirectMessageListEntity)
		private dmList: Repository<DirectMessageListEntity>
	) {}
}
