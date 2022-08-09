import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { CreateDirectMessageDto } from './dto/createDirectMessage.dto';
import { CreateDirectMessageListDto } from './dto/createDirectMessageList.dto';
import { UpdateDirectMessageDto } from './dto/updateDirectMessage.dto';
import { UpdateDirectMessageListDto } from './dto/updateDirectMessageList.dto';

/* This class is a controller that is
handling the requests that are being sent to the server */
@Controller('direct-message')
export class DirectMessageController {
	/**
	 * The constructor function is called
	 * @param {DirectMessageService} dmService - DirectMessageService - This is the
	 * service that we created earlier.
	 */
	constructor(private readonly dmService: DirectMessageService) {}

	/* This is a post request that is creating a message in the database. */
	@Post()
	create(@Body() createDmDto: CreateDirectMessageDto) {
		return this.dmService.create(createDmDto);
	}

	/* This is a get request that is getting all the messages from the database. */
	@Get()
	findAll() {
		return this.dmService.findAll();
	}

	/* This is a get request that is getting a message from the database. */
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.dmService.findOne(+id);
	}

	/* This is a patch request that is updating a message in the database. */
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateDmDto: UpdateDirectMessageDto) {
		this.dmService.update(+id, updateDmDto);
	}

	/* This is a delete request that is deleting a message from the database. */
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		this.dmService.remove(+id);
	}

	/* This is a post request that is creating a message in the database. */
	@Post('/message')
	createMessage(@Body() createDmListDto: CreateDirectMessageListDto) {
		this.dmService.createList(createDmListDto);
	}

	/* This is a get request that is getting all the messages from the database. */
	@Get('/message')
	findAllMessages() {
		return this.dmService.findAllList();
	}

	/* This is a get request that is getting a message from the database. */
	@Get('/message/:id')
	findOneMessage(@Param('id', ParseIntPipe) id: number) {
		return this.dmService.findOneList(+id);
	}

	/* This is a patch request that is updating a message in the database. */
	@Patch('/message/:id')
	updateMessage(@Param('id', ParseIntPipe) id: number, @Body() updateDmListDto: UpdateDirectMessageListDto) {
		this.dmService.updateList(+id, updateDmListDto);
	}

	/* This is a delete request that is deleting a message from the database. */
	@Delete('/message/:id')
	removeMessage(@Param('id', ParseIntPipe) id: number) {
		this.dmService.removeList(+id);
	}
}
