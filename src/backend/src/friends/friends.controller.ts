import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateFriendsDto } from './dto/createFriends.dto';
import { UpdateFriendsDto } from './dto/updateFriends.dto';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friend: FriendsService) {}

	/* Creating a new friend. */
	@Post()
	create(@Body() createFriendsDto: CreateFriendsDto) {
		try {
			this.friend.create(createFriendsDto);
		} catch (error) {
			console.log(error);
		}
	}

	/* A method that is called when a GET request is made to the /friends endpoint. */
	@Get()
	findAll() {
		try {
			return this.friend.findAll();
		} catch (error) {
			console.log(error);
		}
	}

	/* A method that is called when a GET request is made to the /friends/users/:login
	endpoint. */
	@Get('/users/:login')
	findUserFriends(@Param('login') login: string) {
		try {
			return this.friend.findUserFriends(login);
		} catch (error) {
			console.log(error);
		}
	}

	/* A method that is called when a GET request is made to the
	/friends/:userId/:friendId endpoint. */
	@Get(':userId/:friendId')
	findOne(@Param('userId', ParseIntPipe) userId: number, @Param('friendId', ParseIntPipe) friendId: number) {
		try {
			return this.friend.findOne(userId, friendId);
		} catch (error) {
			console.log(error);
		}
	}

	/* Updating the friend with the id of the user. */
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateFriendsDto: UpdateFriendsDto) {
		try {
			this.friend.update(+id, updateFriendsDto);
		} catch (error) {
			console.log(error);
		}
	}

	/* Deleting a friend. */
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		try {
			this.friend.remove(+id);
		} catch (error) {
			console.log(error);
		}
	}
}
