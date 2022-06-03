

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
