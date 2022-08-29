import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDirectMessageDto } from './dto/createDirectMessage.dto';
import { CreateDirectMessageListDto } from './dto/createDirectMessageList.dto';
import { UpdateDirectMessageDto } from './dto/updateDirectMessage.dto';
import { UpdateDirectMessageListDto } from './dto/updateDirectMessageList.dto';
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

	/*	********************** Direct Message Methods *********************** */
	
	/**
	 * It takes in a CreateDirectMessageDto object, and returns a DirectMessageEntity
	 * object
	 * @param {CreateDirectMessageDto} createDmDto - CreateDirectMessageDto
	 * @returns The DirectMessageEntity is being returned.
	 */
	async create(createDmDto: CreateDirectMessageDto): Promise<DirectMessageEntity> {
		try {
			return await this.dm.save(createDmDto);
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * It returns a promise that resolves to an array of DirectMessageEntity objects
	 * @returns An array of DirectMessageEntity objects.
	 */
	async findAll(): Promise<DirectMessageEntity[]> {
		try {
			return await this.dm.find();
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * It returns a promise that resolves to a DirectMessageEntity object
	 * @param {number} id - number - The id of the direct message you want to find.
	 * @returns A promise of a DirectMessageEntity
	 */
	async findOne(id: number): Promise<DirectMessageEntity> {
		try {
			return await this.dm.findOne({ where: { id } });
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * It takes an id and an updateDmDto, and then it updates the dm with the given id
	 * with the given updateDmDto
	 * @param {number} id - The id of the direct message you want to update.
	 * @param {UpdateDirectMessageDto} updateDmDto - This is the DTO that we created
	 * earlier.
	 */
	async update(id: number, updateDmDto: UpdateDirectMessageDto): Promise<void> {
		try {
			await this.dm.update(id, updateDmDto);
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * Delete the document with the given id.
	 * @param {number} id - number - The id of the entity to delete.
	 */
	async remove(id: number): Promise<void> {
		try {
			await this.dm.delete(id);
		} catch (error) {
			throw error;
		}
	}

	/*	******************** Direct Message List Methods ******************** */

	/**
	 * It takes in a CreateDirectMessageListDto object, and saves it to the database
	 * @param {CreateDirectMessageListDto} createDmListDto -
	 * CreateDirectMessageListDto
	 */
	async createList(createDmListDto: CreateDirectMessageListDto): Promise<void> {
		try {
			await this.dmList.save(createDmListDto);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * It returns all the direct message lists in the database
	 * @returns An array of DirectMessageListEntity objects.
	 */
	async findAllList(): Promise<DirectMessageListEntity[]> {
		try {
			return await this.dmList.find();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * It returns a promise that resolves to a DirectMessageListEntity object
	 * @param {number} id - number - The id of the list you want to find.
	 * @returns A DirectMessageListEntity
	 */
	async findOneList(id: number): Promise<DirectMessageListEntity> {
		try {
			return await this.dmList.findOne({ where: { id } });
		} catch (error) {
			throw error;
		}
	}

	/**
	 * It updates a direct message list with the given id and the given
	 * updateDmListDto
	 * @param {number} id - The id of the list you want to update.
	 * @param {UpdateDirectMessageListDto} updateDmListDto - This is the DTO that we
	 * created earlier.
	 */
	async updateList(id: number, updateDmListDto: UpdateDirectMessageListDto): Promise<void> {
		try {
			await this.dmList.update(id, updateDmListDto);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * It deletes a direct message list from the database
	 * @param {number} id - number - The id of the list to remove
	 */
	async removeList(id: number): Promise<void> {
		try {
			await this.dmList.delete(id);
		} catch (error) {
			throw error;
		}
	}
}
