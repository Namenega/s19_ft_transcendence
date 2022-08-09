import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsEntity } from './entities/friends.entity';

/* The FriendsModule class is a module that imports the TypeOrmModule.forFeature()
method, which is a method that imports the FriendsEntity class, and then exports
the FriendsController and FriendsService classes */
@Module({
  imports: [TypeOrmModule.forFeature([FriendsEntity])],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule {}
