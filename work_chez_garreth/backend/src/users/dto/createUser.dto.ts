import { UserEntity } from "../entities/user.entity";
import { OmitType } from "@nestjs/mapped-types";

/* CreateUserDto is a class that extends UserEntity, but without the id property. */
export class CreateUserDto extends OmitType(UserEntity, ["id"]) {}
