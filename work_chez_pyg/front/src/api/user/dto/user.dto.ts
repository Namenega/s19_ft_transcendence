// import { MatchHistoryDto } from "../../match-history/dto/match-history.dto";
// import { FriendDto } from "../../friends/dto/friend.dto";
// import { ChannelDto } from "../../channels/dto/channel.dto";
// import { ChannelUserDto } from "../../channels/dto/channel_user.dto";
// import { ChannelMessageDto } from "../../channels/dto/channel_message.dto";
// import { DmDto } from "../../dms/dto/dm.dto";
// import { DmMessageDto } from "../../dms/dto/dm_message.dto";

/* Defining the structure of the UserDto object. */
export interface UserDto {
	id: number;
	name: string;
	login: string;
	password: string;
	avatar: string;
	has2FA: boolean;
	secret2FA: string;
	status: string;
	numberOfWin: number;
	numberOfLoss: number;
	// matchHistory: MatchHistoryDto[]
	// friends: FriendDto[]
	// dms: DmDto[]
	// dms_messages: DmMessageDto[]
	// channels: ChannelDto[]
	// channels_messages: ChannelMessageDto[]
	// channels_users: ChannelUserDto[]
	latestTimeOnline: string
}
