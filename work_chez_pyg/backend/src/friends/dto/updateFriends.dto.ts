import { PartialType } from "@nestjs/mapped-types";
import { CreateFriendsDto } from "./createFriends.dto";

export class UpdateFriendsDto extends PartialType(CreateFriendsDto) {}
