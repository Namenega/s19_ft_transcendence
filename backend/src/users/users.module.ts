//Import other Module to have access to external methods
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  //export USersService so we can have access to it
  //outside of the module
  exports: [UsersService]
})
export class UsersModule {}
