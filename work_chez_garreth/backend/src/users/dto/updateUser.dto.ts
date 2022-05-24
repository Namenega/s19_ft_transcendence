import { CreateUserDto } from './createUser.dto';
import { PartialType } from "@nestjs/mapped-types";

/* The UpdateUserDto class extends the CreateUserDto class, and it's a partial
class */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
