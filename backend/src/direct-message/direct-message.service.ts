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
		return await this.dm.save(createDmDto);
	}
	
	/**
	 * It returns a promise that resolves to an array of DirectMessageEntity objects
	 * @returns An array of DirectMessageEntity objects.
	 */
	async findAll(): Promise<DirectMessageEntity[]> {
		return await this.dm.find();
	}
	
	/**
	 * It returns a promise that resolves to a DirectMessageEntity object
	 * @param {number} id - number - The id of the direct message you want to find.
	 * @returns A promise of a DirectMessageEntity
	 */
	async findOne(id: number): Promise<DirectMessageEntity> {
		return await this.dm.findOne(id);
	}
	
	/**
	 * It takes an id and an updateDmDto, and then it updates the dm with the given id
	 * with the given updateDmDto
	 * @param {number} id - The id of the direct message you want to update.
	 * @param {UpdateDirectMessageDto} updateDmDto - This is the DTO that we created
	 * earlier.
	 */
	async update(id: number, updateDmDto: UpdateDirectMessageDto): Promise<void> {
		await this.dm.update(id, updateDmDto);
	}
	
	/**
	 * Delete the document with the given id.
	 * @param {number} id - number - The id of the entity to delete.
	 */
	async remove(id: number): Promise<void> {
		await this.dm.delete(id);
	}

	/*	******************** Direct Message List Methods ******************** */

	/**
	 * It takes in a CreateDirectMessageListDto object, and saves it to the database
	 * @param {CreateDirectMessageListDto} createDmListDto -
	 * CreateDirectMessageListDto
	 */
	async createList(createDmListDto: CreateDirectMessageListDto): Promise<void> {
		await this.dmList.save(createDmListDto);
	}

	/**
	 * It returns all the direct message lists in the database
	 * @returns An array of DirectMessageListEntity objects.
	 */
	async findAllList(): Promise<DirectMessageListEntity[]> {
		return await this.dmList.find();
	}

	/**
	 * It returns a promise that resolves to a DirectMessageListEntity object
	 * @param {number} id - number - The id of the list you want to find.
	 * @returns A DirectMessageListEntity
	 */
	async findOneList(id: number): Promise<DirectMessageListEntity> {
		return await this.dmList.findOne(id);
	}

	/**
	 * It updates a direct message list with the given id and the given
	 * updateDmListDto
	 * @param {number} id - The id of the list you want to update.
	 * @param {UpdateDirectMessageListDto} updateDmListDto - This is the DTO that we
	 * created earlier.
	 */
	async updateList(id: number, updateDmListDto: UpdateDirectMessageListDto): Promise<void> {
		await this.dmList.update(id, updateDmListDto);
	}

	/**
	 * It deletes a direct message list from the database
	 * @param {number} id - number - The id of the list to remove
	 */
	async removeList(id: number): Promise<void> {
		await this.dmList.delete(id);
	}
}
