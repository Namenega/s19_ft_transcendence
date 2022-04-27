import { IsEmail, IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

/* It's a class that defines the shape of the data that will be sent to the server
when a user registers */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
export default RegisterDto;
