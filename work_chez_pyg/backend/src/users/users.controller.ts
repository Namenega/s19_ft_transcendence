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
    return this.user.create(createUserDto);
  }

  /* This is a method that is called when a user wants to find all the accounts. */
  @Get()
  findAll() {
    return this.user.findAll();
  }

 /* This is a method that is called when a user wants to find their account by id. */
  @Get('/rank')
  findAllRank() {
    return this.user.findAllRank();
  }

  /* This is a method that is called when a user wants to find their account by id. */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.user.findOne(+id);
  }

  /* This is a method that is called when a user wants to find their account by id. */
  @Get('/complete/:id')
  findCompleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.user.findCompleteOne(+id);
  }

  /* This is a method that is called when a user wants to find their account by
  name. */
  @Get('/name/:name')
  findOneByName(@Param('name') name: string) {
    return this.user.findOneByName(name);
  }

  /* A method that is called when a user wants to find their account by login. */
  @Get('/login/:login')
  findOneByLogin(@Param('login') login: string) {
    return this.user.findOneByLogin(login);
  }

  /* A method that is called when a user wants to update their account. */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    this.user.update(+id, updateUserDto);
  }

  /* A method that is called when a user wants to delete their account. */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.user.remove(+id);
  }

  /* A method that is called when a user wants to verify their password. */
  @Get('2fa/secret')
  getTwoFactorAuthenticationSecret() {
    return this.user.twoFactorAuthenticationSecret();
  }

  /* A method that is called when a user wants to verify their password. */
  @Post('2fa/verify')
  verifyTwoFactorAuthentication(@Body() obj: { secret: string, token: string }) {
    return this.user.verifyTwoFactorAuthentication(obj.secret, obj.token);
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
