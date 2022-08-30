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
		try {
			return this.dmService.create(createDmDto);
		} catch (error) {
			console.log(error);
		}
	}

	/* This is a get request that is getting all the messages from the database. */
	@Get()
	findAll() {
		try {
			return this.dmService.findAll();
		} catch (error) {
			console.log(error);
		}
	}

	/* This is a post request that is creating a message in the database. */
	@Post('/message')
	createMessage(@Body() createDmListDto: CreateDirectMessageListDto) {
		try {
			this.dmService.createList(createDmListDto);
		} catch (error) {
			console.log(error);
		}
	}

	/* This is a get request that is getting all the messages from the database. */
	@Get('/message')
	findAllMessages() {
		try {
			return this.dmService.findAllList();
		} catch (error) {
			console.log(error);
		}
	}

	/* This is a get request that is getting a message from the database. */
	@Get('/message/:id')
	findOneMessage(@Param('id', ParseIntPipe) id: number) {
		try {
			return this.dmService.findOneList(+id);
		} catch (error) {
			console.log(error);
		}
	}

	/* This is a patch request that is updating a message in the database. */
	@Patch('/message/:id')
	updateMessage(@Param('id', ParseIntPipe) id: number, @Body() updateDmListDto: UpdateDirectMessageListDto) {
		try {
			this.dmService.updateList(+id, updateDmListDto);
		} catch (error) {
			console.log(error);
		}
	}

	/* This is a delete request that is deleting a message from the database. */
	@Delete('/message/:id')
	removeMessage(@Param('id', ParseIntPipe) id: number) {
		try {
			this.dmService.removeList(+id);
		} catch (error) {
			console.log(error);
		}
	}

	/* This is a get request that is getting a message from the database. */
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		try {
			return this.dmService.findOne(+id);
		} catch (error) {
			console.log(error);
		}
	}

	/* This is a patch request that is updating a message in the database. */
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateDmDto: UpdateDirectMessageDto) {
		try {
			this.dmService.update(+id, updateDmDto);
		} catch (error) {
			console.log(error);
		}
	}

	/* This is a delete request that is deleting a message from the database. */
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		try {
			this.dmService.remove(+id);
		} catch (error) {
			console.log(error);
		}
	}
}
