import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendsEntity } from './entities/friends.entity';

@Injectable()
export class FriendsService {
	constructor(
		@InjectRepository(FriendsEntity)
		private FriendsRepo: Repository<FriendsEntity>
	) {}

	async create() {}
}
