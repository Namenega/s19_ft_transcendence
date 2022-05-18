import { OmitType } from "@nestjs/mapped-types";
import { FriendsEntity } from "../entities/friends.entity";

export class CreateFriendsDto extends OmitType(FriendsEntity, ["id"]) {}
