import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import TokenPayload from './tokenPayload.interface'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService
	) {}

	/**
	 * We hash the password, create a new user, and return the user
	 * @param {RegisterDto} registrationData - RegisterDto - this is the data that the
	 * user will send to the server when they register.
	 * @returns The created user.
	 */
	public async register(registrationData: RegisterDto) {
		const hashedPassword = await bcrypt.hash(registrationData.password, 10);
		try {
			const createdUser = await this.usersService.create({
				...registrationData,
				password: hashedPassword
			});
			createdUser.password = undefined;
			return createdUser;
		} catch (error) {
			if (error?.code === PostgresErrorCode.UniqueViolation) {
				throw new HttpException('User with that email already exists',
					HttpStatus.BAD_REQUEST);
			}
			throw new HttpException('Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * It gets a user by email, verifies the password, and returns the user
	 * @param {string} email - The email of the user that is trying to log in.
	 * @param {string} plainTextPassword - The password that the user entered in the
	 * login form.
	 * @returns The user object with the password property set to undefined.
	 */
	public async getAuthenticatedUser(email: string, plainTextPassword: string) {
		try {
			const user = await this.usersService.getByEmail(email);
			await this.verifyPassword(plainTextPassword, user.password)
			user.password = undefined;
			return user;
		} catch (error) {
			throw new HttpException('Wrong credentials provided',
				HttpStatus.BAD_REQUEST);			
		}
	}

	/**
	 * It takes a plain text password and a hashed password, and returns true if the
	 * plain text password matches the hashed password
	 * @param {string} plainTextPassword - The password that the user entered in the
	 * login form.
	 * @param {string} hashedPassword - The password that was stored in the database.
	 */
	private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
		const isPasswordMatching = await bcrypt.compare(
			plainTextPassword,
			hashedPassword
		);
		if (!isPasswordMatching) {
			throw new HttpException('Wrong credentials provided',
				HttpStatus.BAD_REQUEST);
		}
	}
}
