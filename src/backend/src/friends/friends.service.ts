import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendsDto } from './dto/createFriends.dto';
import { UpdateFriendsDto } from './dto/updateFriends.dto';
import { FriendsEntity } from './entities/friends.entity';

@Injectable()
export class FriendsService {
	/**
	 * The constructor function is used to inject the FriendsRepo into the
	 * FriendsService class
	 * @param FriendsRepo - Repository<FriendsEntity>
	 */
	constructor(
		@InjectRepository(FriendsEntity)
		private FriendsRepo: Repository<FriendsEntity>
	) {}

	/**
	 * The function takes in a CreateFriendsDto object, and then saves it to the
	 * database
	 * @param {CreateFriendsDto} CreateFriendsDto - This is the DTO that we created
	 * earlier.
	 */
	async create(CreateFriendsDto: CreateFriendsDto): Promise<void> {
		await this.FriendsRepo.save(CreateFriendsDto);
	}

	/**
	 * It returns a promise that resolves to an array of FriendsEntity objects
	 * @returns An array of FriendsEntity objects.
	 */
	async findAll(): Promise<FriendsEntity[]> {
		return await this.FriendsRepo.find();
	}

	/**
	 * It returns a promise of a FriendsEntity object, which is the result of a query
	 * to the FriendsRepo, which is a repository of FriendsEntity objects
	 * @param {number} userId - number - The id of the user who's friends we want to
	 * find
	 * @param {number} friendId - number - This is the id of the friend you want to
	 * find.
	 * @returns A single friend entity
	 */
	async findOne(userId: number, friendId: number): Promise<FriendsEntity> {
		return await this.FriendsRepo.findOne({
			relations: ['user'],
			where: { user: { id: userId }, friendId: friendId }
		});
	}	

	/**
	 * It returns an array of FriendsEntity objects, where the user property of each
	 * FriendsEntity object is populated with the UserEntity object that matches the
	 * login parameter
	 * @param {string} login - string - the login of the user whose friends we want to
	 * find
	 * @returns An array of FriendsEntity objects.
	 */
	async findUserFriends(login: string): Promise<FriendsEntity[]> {
		return await this.FriendsRepo.find({
			relations: ['user'],
			where: { user: {login: login}}
		});
	}

	/**
	 * The function takes in an id and an updateFriendsDto, and then uses the
	 * FriendsRepo to update the friend with the given id with the given
	 * updateFriendsDto
	 * @param {number} id - number - The id of the friend to update
	 * @param {UpdateFriendsDto} updateFriendsDto - This is the DTO that we created
	 * earlier.
	 */
	async update(id: number, updateFriendsDto: UpdateFriendsDto): Promise<void> {
		await this.FriendsRepo.update(id, updateFriendsDto);
	}

	/**
	 * This function deletes a friend from the database
	 * @param {number} id - number - The id of the friend to be deleted
	 * @param {UpdateFriendsDto} updateFriendsDto - This is the DTO that we created
	 * earlier.
	 */
	async remove(id: number): Promise<void> {
		await this.FriendsRepo.delete(id);
	}
}
