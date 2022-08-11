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
		this.friend.create(createFriendsDto);
	}

	/* A method that is called when a GET request is made to the /friends endpoint. */
	@Get()
	findAll() {
		return this.friend.findAll();
	}

	/* A method that is called when a GET request is made to the /friends/users/:login
	endpoint. */
	@Get('/users/:login')
	findUserFriends(@Param('login') login: string) {
		return this.friend.findUserFriends(login);
	}

	/* A method that is called when a GET request is made to the
	/friends/:userId/:friendId endpoint. */
	@Get(':userId/:friendId')
	findOne(@Param('userId', ParseIntPipe) userId: number, @Param('friendId', ParseIntPipe) friendId: number) {
		return this.friend.findOne(userId, friendId);
	}

	/* Updating the friend with the id of the user. */
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateFriendsDto: UpdateFriendsDto) {
		this.friend.update(+id, updateFriendsDto);
	}

	/* Deleting a friend. */
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		this.friend.remove(+id);
	}
}
