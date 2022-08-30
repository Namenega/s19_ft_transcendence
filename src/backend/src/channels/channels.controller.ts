import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/createChannel.dto";
import { CreateChannelMessagesDto } from "./dto/createChannelMessages.dto";
import { CreateChannelUserDto } from "./dto/createChannelUser.dto";
import { UpdateChannelDto } from "./dto/updateChannel.dto";
import { UpdateChannelMessagesDto } from "./dto/updateChannelMessages.dto";
import { UpdateChannelUserDto } from "./dto/updateChannelUser.dto";

@Controller('channels')
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService) {}

	/* ****************************** ChannelMessage ************************ */
	@Post('/message')
	createMessage(@Body() createChannelMessageDto: CreateChannelMessagesDto) {
		try {
			return this.channelsService.createMessage(createChannelMessageDto);
		} catch (error) {
			console.log(error);
		}
	}

	@Get('/message')
	findAllMessages() {
		try {
			return this.channelsService.findAllMessages();
		} catch (error) {
			console.log(error);
		}
	}

	@Get('/message/:id')
	findOneMessage(@Param('id', ParseIntPipe) id: number) {
		try {
			return this.channelsService.findOneMessage(+id);
		} catch (error) {
			console.log(error);
		}
	}

	@Patch('/message/:id')
	updateMessage(@Param('id', ParseIntPipe) id: number,
			@Body() updateChannelMessageDto: UpdateChannelMessagesDto) {
		try {
			return this.channelsService.updateMessage(+id, updateChannelMessageDto);
		} catch (error) {
			console.log(error);
		}
	}

	@Delete('/message/:id')
	removeMessage(@Param('id', ParseIntPipe) id: number) {
		try {
			return this.channelsService.removeMessage(+id);
		} catch (error) {
			console.log(error);
		}
	}


	/* ****************************** ChannelUser *************************** */
	@Post('/user')
	createUser(@Body() createChannelUserDto: CreateChannelUserDto) {
		try {
			return this.channelsService.createUser(createChannelUserDto);
		} catch (error) {
			console.log(error);
		}
	}
  
	@Get('/user')
	findAllUsers() {
		try {
			return this.channelsService.findAllUsers();
		} catch (error) {
			console.log(error);
		}
	}
  
	@Get('/user/:id')
	findOneUser(@Param('id', ParseIntPipe) id: number) {
		try {
			return this.channelsService.findOneUser(+id);
		} catch (error) {
			console.log(error);
		}
	}
  
	@Patch('/user/:id')
	updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateChannelUserDto: UpdateChannelUserDto) {
		try {
			return this.channelsService.updateUser(+id, updateChannelUserDto);
		} catch (error) {
			console.log(error);
		}
	}
  
	@Delete('/user/:id')
	removeUser(@Param('id', ParseIntPipe) id: number) {
		try {
			return this.channelsService.removeUser(+id);
		} catch (error) {
			console.log(error);
		}
	}
  
	@Get('/password_verification/:id/:password')
	passwordVerification(@Param('id', ParseIntPipe) id: number, @Param('password') password: string) {
		try {
			return this.channelsService.passwordVerification(+id, password);
		} catch (error) {
			console.log(error);
		}
	}

	/* ****************************** Channel ******************************* */
	@Post()
	create(@Body() createChannelDto: CreateChannelDto) {
		try {
			return this.channelsService.create(createChannelDto);
		} catch (error) {
			console.log(error);
		}
	}

	@Get()
	findAll() {
		try {
			return this.channelsService.findAll();
		} catch (error) {
			console.log(error);
		}
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		try {
			return this.channelsService.findOne(+id);
		} catch (error) {
			console.log(error);
		}
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateChannelDto: UpdateChannelDto) {
		try {
			return this.channelsService.update(+id, updateChannelDto);
		} catch (error) {
			console.log(error);
		}
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		try {
			return this.channelsService.remove(+id);
		} catch (error) {
			console.log(error);
		}
	}
}
