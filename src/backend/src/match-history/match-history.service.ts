import { Injectable } from '@nestjs/common';
import { CreateMatchHistoryDto } from './dto/createMatchHistory.dto';
import { UpdateMatchHistoryDto } from './dto/updateMatchHistory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchHistoryEntity } from './entities/matchHistory.entity';

/* It's a service class that
provides methods to create, read, update, and delete match history records */
@Injectable()
export class MatchHistoryService {
	/**
	 * The constructor function is used to inject the MatchHistoryRepo into the
	 * MatchHistoryService class
	 * @param MatchHistoryRepo - Repository<MatchHistoryEntity>
	 */
	constructor(
		@InjectRepository(MatchHistoryEntity)
		private MatchHistoryRepo: Repository<MatchHistoryEntity>
	) {}
	
	/**
	 * This function takes in a CreateMatchHistoryDto object and saves it to the
	 * database
	 * @param {CreateMatchHistoryDto} createMatchHistoryDto - CreateMatchHistoryDto
	 */
	async create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void> {
		try {
			await this.MatchHistoryRepo.save(createMatchHistoryDto);
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * It returns a promise of an array of MatchHistoryEntity objects
	 * @returns An array of MatchHistoryEntity objects.
	 */
	async findAll(): Promise<MatchHistoryEntity[]>  {
		try {
			return await this.MatchHistoryRepo.find();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * It returns a list of MatchHistoryEntity objects that have a relationship with
	 * a UserEntity object whose login is equal to the login parameter
	 * @param {string} login - string - this is the login of the user we want to
	 * find the match history of.
	 * @returns An array of MatchHistoryEntity objects.
	 */
	async findMatchHistoryOfUser(login: string): Promise<MatchHistoryEntity[]> {
		try {
			return await this.MatchHistoryRepo.find({
				relations: ['user'],
				where: { user: {login: login} }}
			);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * This function returns a Promise of a MatchHistoryEntity
	 * @param {number} id - number - This is the id of the match history you want to
	 * find.
	 * @returns The MatchHistoryEntity
	 */
	async findOne(id: number): Promise<MatchHistoryEntity> {
		try {
			return await this.MatchHistoryRepo.findOne({ where: { id } });
		} catch (error) {
			throw error;
		}
	}

	/**
	 * This function updates a match history record in the database
	 * @param {number} id - number - The id of the match history you want to update.
	 * @param {UpdateMatchHistoryDto} updateMatchHistoryDto - This is the DTO that
	 * we created earlier.
	 */
	async update(id: number, updateMatchHistoryDto: UpdateMatchHistoryDto): Promise<void>  {
		try {
			await this.MatchHistoryRepo.update(id, updateMatchHistoryDto);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * This function deletes a match history by id
	 * @param {number} id - number - The id of the match history to delete
	 */
	async remove(id: number): Promise<void> {
		try {
			await this.MatchHistoryRepo.delete(id);
		} catch (error) {
			throw error;
		}
	}
}
