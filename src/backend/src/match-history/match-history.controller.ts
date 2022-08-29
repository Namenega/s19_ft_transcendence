import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
import { CreateMatchHistoryDto } from './dto/createMatchHistory.dto';
import { UpdateMatchHistoryDto } from './dto/updateMatchHistory.dto';

/* This class is a controller that has methods that allow the user to create, find,
update, and delete match histories */
@Controller('match-history')
export class MatchHistoryController {
	constructor(private readonly matchHistoryService: MatchHistoryService) {}

	/* This is a post request that takes in a body and creates a match history with
	the body. */
	@Post()
	create(@Body() createMatchHistoryDto: CreateMatchHistoryDto) {
		try {
			this.matchHistoryService.create(createMatchHistoryDto);
		} catch (error) {
			console.log(error);
		}
	}
  
	/* This is a get request that returns all the match histories. */
	@Get()
	findAll() {
		try {
			return this.matchHistoryService.findAll();
		} catch (error) {
			console.log(error);
		}
	}
  
	/* This is a get request that takes in a login and returns the match history of
	the user with that login. */
	@Get('/users/:login')
	findMatchHistoryOfUser(@Param('login') login: string) {
		try {
			return this.matchHistoryService.findMatchHistoryOfUser(login);
		} catch (error) {
			console.log(error);
		}
	}
  
	/* A get request that takes in an id and returns the match history with that id. */
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		try {
			return this.matchHistoryService.findOne(+id);
		} catch (error) {
			console.log(error);
		}
	}
  
	/* Updating the match history with the id of the match history. */
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateMatchHistoryDto: UpdateMatchHistoryDto) {
		try {
			this.matchHistoryService.update(+id, updateMatchHistoryDto);
		} catch (error) {
			console.log(error);
		}
	}
  
	/* Deleting the match history with the id of the match history. */
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		try {
			this.matchHistoryService.remove(+id);
		} catch (error) {
			console.log(error);
		}
	}
}
