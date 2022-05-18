import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendsDto } from './dto/createFriends.dto';
import { FriendsEntity } from './entities/friends.entity';

@Injectable()
export class FriendsService {
	constructor(
		@InjectRepository(FriendsEntity)
		private FriendsRepo: Repository<FriendsEntity>
	) {}

	async create(CreateFriendsDto: CreateFriendsDto): Promise<void> {
		await this.FriendsRepo.save(CreateFriendsDto);
	}

	async findAll(): Promise<FriendsEntity[]> {
		return await this.FriendsRepo.find();
	}

	async findUserFriends(login: string): Promise<FriendsEntity[]> {
		return await this.FriendsRepo.find({
			relations: ['user'],
			where: { user: {login: login}}
		});
	}
}
