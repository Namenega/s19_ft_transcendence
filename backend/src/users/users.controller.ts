
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';
// import { User } from './interface/user.interface';

@Controller('users')
export class UsersController {

	//Constructor
	constructor(private usersService: UsersService) {}

	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		this.usersService.create(createUserDto);
	}
}
