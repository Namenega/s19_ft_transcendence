import { FriendsDto } from "./friends.dto";

export type CreateFriendsDto = Omit<FriendsDto, "id">
