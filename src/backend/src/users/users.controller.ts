import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

/* This class is a controller that
contains methods that are called when a user wants to create, find, update, or
delete an account */
@Controller('users')
export class UsersController {
  constructor(private readonly user: UsersService) {}

  /* This is a method that is called when a user wants to create an account. */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try { 
      return this.user.create(createUserDto);
    } catch (error) {
      console.log(error);
    }
  }

  /* This is a method that is called when a user wants to find all the accounts. */
  @Get()
  findAll() {
    try { 
      return this.user.findAll();
    } catch (error) {
      console.log(error);
    }
  }

 /* This is a method that is called when a user wants to find their account by id. */
  @Get('/rank')
  findAllRank() {
    try { 
      return this.user.findAllRank();
    } catch (error) {
      console.log(error);
    }
  }

  /* This is a method that is called when a user wants to find their account by id. */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.user.findOne(+id);
    } catch (error) {
      console.log(error);
    }
  }

  /* This is a method that is called when a user wants to find their account by id. */
  @Get('/complete/:id')
  findCompleteOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.user.findCompleteOne(+id);
    } catch (error) {
      console.log(error);
    }
  }

  /* This is a method that is called when a user wants to find their account by
  name. */
  @Get('/name/:name')
  findOneByName(@Param('name') name: string) {
    try {
      return this.user.findOneByName(name);
    } catch (error) {
      console.log(error);
    }
  }

  /* A method that is called when a user wants to find their account by login. */
  @Get('/login/:login')
  findOneByLogin(@Param('login') login: string) {
    try {
      return this.user.findOneByLogin(login);
    } catch (error) {
      console.log(error);
    }
  }

  /* A method that is called when a user wants to update their account. */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      this.user.update(+id, updateUserDto);
    } catch (error) {
      console.log(error);
    }
  }

  /* A method that is called when a user wants to delete their account. */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    try {
      this.user.remove(+id);
    } catch (error) {
      console.log(error);
    }
  }

  /* A method that is called when a user wants to verify their password. */
  @Get('2fa/secret')
  getTwoFactorAuthenticationSecret() {
    try {
      return this.user.twoFactorAuthenticationSecret();
    } catch (error) {
      console.log(error);
    }
  }

  /* A method that is called when a user wants to verify their password. */
  @Post('2fa/verify')
  verifyTwoFactorAuthentication(@Body() obj: { secret: string, token: string }) {
    try {
      return this.user.verifyTwoFactorAuthentication(obj.secret, obj.token);
    } catch (error) {
      console.log(error);
    }
  }

  /* A method that is called when a user wants to verify their password. */
  @Get('/password_verification/:id/:password')
  passwordVerification(@Param('id', ParseIntPipe) id: number, @Param('password') password: string) {
    try {
      return this.user.passwordVerification(+id, password);
    } catch (error) {
      console.log(error);
    }
  }
}
