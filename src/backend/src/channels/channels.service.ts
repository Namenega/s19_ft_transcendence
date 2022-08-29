import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateChannelDto } from "./dto/createChannel.dto";
import { CreateChannelMessagesDto } from "./dto/createChannelMessages.dto";
import { CreateChannelUserDto } from "./dto/createChannelUser.dto";
import { UpdateChannelDto } from "./dto/updateChannel.dto";
import { UpdateChannelMessagesDto } from "./dto/updateChannelMessages.dto";
import { UpdateChannelUserDto } from "./dto/updateChannelUser.dto";
import { ChannelsEntity } from "./entities/channels.entity";
import { ChannelsMessagesEntity } from "./entities/channelsMessages.entity";
import { ChannelsUsersEntity } from "./entities/channelsUsers.entity";

const bcrypt = require('bcrypt');

/* "This class contains all of the functions that we will be using to interact with
the database."

The first thing that we do is import the necessary modules */
@Injectable()
export class ChannelsService {
	/**
	 * We're injecting the repositories for the Channels, ChannelsUsers, and
	 * ChannelsMessages entities into the constructor
	 * @param chan - Repository<ChannelsEntity>
	 * @param chanUser - Repository<ChannelsUsersEntity>
	 * @param chanMsg - Repository<ChannelsMessagesEntity>
	 */
	constructor(
		@InjectRepository(ChannelsEntity)
		private chan: Repository<ChannelsEntity>,

		@InjectRepository(ChannelsUsersEntity)
		private chanUser: Repository<ChannelsUsersEntity>,

		@InjectRepository(ChannelsMessagesEntity)
		private chanMsg: Repository<ChannelsMessagesEntity>
	) {}

	/* ****************************** Channel ******************************* */

	/**
	 * It takes in a CreateChannelDto object, and returns a Promise of a
	 * ChannelsEntity object
	 * @param {CreateChannelDto} createChannelDto - CreateChannelDto - This is the DTO
	 * that we created earlier.
	 * @returns The channel that was created.
	 */
	async create(createChannelDto: CreateChannelDto): Promise<ChannelsEntity> {
		try {
			return await this.chan.save(createChannelDto);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * It returns a promise that resolves to an array of ChannelsEntity objects
	 * @returns An array of ChannelsEntity objects.
	 */
	async findAll(): Promise<ChannelsEntity[]> {
		try {
			return await this.chan.find();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * This function is an asynchronous function that returns a promise of a
	 * ChannelsEntity
	 * @param {number} id - number - The id of the channel you want to find.
	 * @returns The channel with the given id.
	 */
	async findOne(id: number): Promise<ChannelsEntity> {
		try {
			return await this.chan.findOne({ where: { id } });
		} catch (error) {
			throw error;
		}
	}

	/**
	 * It takes in an id and an updateChannelDto, and then it calls the update
	 * function in the channel service, passing in the id and the updateChannelDto
	 * @param {number} id - The id of the channel you want to update.
	 * @param {UpdateChannelDto} updateChannelDto - This is the data transfer object
	 * (DTO) that contains the data that we want to update.
	 */
	async update(id: number, updateChannelDto: UpdateChannelDto): Promise<void> {
		try {
			await this.chan.update(id, updateChannelDto);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * "This function deletes a channel from the database."
	 * 
	 * The first line of the function is the function declaration. It's a function
	 * named remove that takes a single parameter named id. The parameter is a number.
	 * The function returns a Promise that resolves to void
	 * @param {number} id - The id of the channel to remove.
	 */
	async remove(id: number): Promise<void> {
		try {
			await this.chan.delete(id);
		} catch (error) {
			throw error;
		}
	}

	/* ****************************** ChannelMessage ************************ */

	/**
	 * It takes in a CreateChannelMessagesDto object, and saves it to the database
	 * @param {CreateChannelMessagesDto} createChannelMessageDto - This is the DTO
	 * that we created earlier.
	 */
	async createMessage(createChannelMessageDto: CreateChannelMessagesDto): Promise<void> {
		try {
			await this.chanMsg.save(createChannelMessageDto);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * It returns a promise that resolves to an array of ChannelsMessagesEntity
	 * objects
	 * @returns An array of ChannelsMessagesEntity objects.
	 */
	async findAllMessages(): Promise<ChannelsMessagesEntity[]> {
		try {
			return await this.chanMsg.find();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * It returns a promise of a ChannelsMessagesEntity object
	 * @param {number} id - number - The ID of the message you want to find.
	 * @returns A single message from the database.
	 */
	async findOneMessage(id: number): Promise<ChannelsMessagesEntity> {
		try {
			return await this.chanMsg.findOne({ where: { id } });
		} catch (error) {
			throw error;
		}
	}

	/**
	 * This function takes in a message id and an updateChannelMessageDto object and
	 * updates the message with the id with the new information
	 * @param {number} id - The id of the message to be updated.
	 * @param {UpdateChannelMessagesDto} updateChannelMessageDto - This is the DTO
	 * that we created earlier.
	 */
	async updateMessage(id: number, updateChannelMessageDto: UpdateChannelMessagesDto):
			Promise<void> {
		try {
			await this.chanMsg.update(id, updateChannelMessageDto);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * It deletes a message from the database
	 * @param {number} id - The ID of the message to remove.
	 */
	async removeMessage(id: number): Promise<void> {
		try {
			await this.chanMsg.delete(id);
		} catch (error) {
			throw error;
		}
	}

	/* ****************************** ChannelUser *************************** */

	/**
	 * It takes a CreateChannelUserDto object as a parameter, and then saves it to the
	 * database
	 * @param {CreateChannelUserDto} createChannelUserDto - This is the object that we
	 * will be passing to the function.
	 */
	async createUser(createChannelUserDto: CreateChannelUserDto): Promise<void> {
		try {
			await this.chanUser.save(createChannelUserDto);
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * It returns a promise that resolves to an array of ChannelsUsersEntity objects
	 * @returns An array of ChannelsUsersEntity objects.
	 */
	async findAllUsers(): Promise<ChannelsUsersEntity[]> {
		try {
			return await this.chanUser.find();
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * This function returns a promise of a ChannelsUsersEntity object
	 * @param {number} id - number - the id of the user you want to find
	 * @returns The channel user with the given id.
	 */
	async findOneUser(id: number): Promise<ChannelsUsersEntity> {
		try {
			return await this.chanUser.findOne({ where: { id } });
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * It takes in a user id and an updateChannelUserDto object and updates the user
	 * with the given id with the data from the updateChannelUserDto object
	 * @param {number} id - The id of the channel user you want to update.
	 * @param {UpdateChannelUserDto} updateChannelUserDto - This is the DTO that we
	 * created earlier.
	 */
	async updateUser(id: number, updateChannelUserDto: UpdateChannelUserDto): Promise<void> {
		try {
			await this.chanUser.update(id, updateChannelUserDto);
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * It deletes a user from the database
	 * @param {number} id - The id of the user to remove.
	 */
	async removeUser(id: number): Promise<void> {
		try {
			await this.chanUser.delete(id);
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * It takes in a channel id and a password, and returns a boolean value of whether
	 * the password is correct or not
	 * @param {number} id - the id of the channel
	 * @param {string} password - the password that the user entered
	 * @returns A boolean value.
	 */
	async passwordVerification(id: number, password: string): Promise<boolean> {
		try {
			const channel = await this.chan.findOne({ where: { id } });
			return await bcrypt.compare(password, channel.password); //compare non-encrypted-password with encrypted-password-in-database using bcrypt
		} catch (error) {
			throw error;
		}
	}
}
