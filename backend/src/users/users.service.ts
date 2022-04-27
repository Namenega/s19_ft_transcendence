import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entity/user.entity';
import CreateUserDto from './dto/createUser.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
	) {}

	/**
	 * It gets a user by email
	 * @param {string} email - string - the email of the user we want to find
	 * @returns The user object
	 */
	async getByEmail(email: string) {
		const user = await this.usersRepository.findOne({ email });
		if (user) {
			return user;
		}
		throw new HttpException('User with this email does not exist',
				HttpStatus.NOT_FOUND);
	}

	/**
	 * It creates a new user and saves it to the database
	 * @param {CreateUserDto} userData - CreateUserDto
	 * @returns The new user that was created.
	 */
	async create(userData: CreateUserDto) {
		const newUser = await this.usersRepository.create(userData);
		await this.usersRepository.save(newUser);
		return newUser;
	}
}
