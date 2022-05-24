import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectMessageController } from './direct-message.controller';
import { DirectMessageService } from './direct-message.service';
import { DirectMessageEntity } from './entities/directMessage.entity';
import { DirectMessageListEntity } from './entities/directMessageList.entity';

/* This class is a module that imports the TypeOrmModule and the
DirectMessageController, and provides the DirectMessageService */
@Module({
  imports: [TypeOrmModule.forFeature([DirectMessageEntity, DirectMessageListEntity])],
  controllers: [DirectMessageController],
  providers: [DirectMessageService]
})
export class DirectMessageModule {}
