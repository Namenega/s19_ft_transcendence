import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { ChannelsEntity } from "./entities/channels.entity";
import { ChannelsMessagesEntity } from "./entities/channelsMessages.entity";
import { ChannelsUsersEntity } from "./entities/channelsUsers.entity";


@Module({
	imports: [TypeOrmModule.forFeature([ChannelsEntity, ChannelsMessagesEntity, ChannelsUsersEntity])],
	controllers: [ChannelsController],
	providers: [ChannelsService],
})
export class ChannelsModule {}
