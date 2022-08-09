import { PartialType } from "@nestjs/mapped-types";
import { CreateFriendsDto } from "./createFriends.dto";

/* This class extends the CreateFriendsDto class and allows for partial updates */
export class UpdateFriendsDto extends PartialType(CreateFriendsDto) {}
