import { OmitType } from "@nestjs/mapped-types";
import { FriendsEntity } from "../entities/friends.entity";

/* The CreateFriendsDto class is a TypeScript class that extends the FriendsEntity class and omits the
id property */
export class CreateFriendsDto extends OmitType(FriendsEntity, ["id"]) {}
