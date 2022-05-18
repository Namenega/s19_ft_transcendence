import { OmitType } from "@nestjs/mapped-types";
import { FriendsEntity } from "../entities/friends.entity";

export class UpdateFriendsDto extends OmitType(FriendsEntity, ["id"]) {}
