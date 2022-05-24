import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity"

/* The UsersModule class is a module that imports the TypeOrmModule.forFeature()
method, which is a method that imports the UserEntity class, and then exports
the UsersController and UsersService classes */
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
