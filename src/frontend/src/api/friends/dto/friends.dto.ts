import { UserDto } from "../../user/dto/user.dto";

/* Creating a new interface called FriendsDto. */
export interface FriendsDto {
	id: number;
	user: UserDto;
	friendId: number;
}
