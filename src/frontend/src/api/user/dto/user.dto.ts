import { MatchHistoryDto } from "../../match-history/dto/match-history.dto";
import { FriendsDto } from "../../friends/dto/friends.dto";
import { ChannelDto } from "../../channel/dto/channel.dto";
import { ChannelUserDto } from "../../channel/dto/channel_user.dto";
import { ChannelMessageDto } from "../../channel/dto/channel_message.dto";
import { DmDto } from "../../dms/dto/dm.dto";
import { DmMessageDto } from "../../dms/dto/dm_message.dto";

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
	elo: number;
	matchHistory: MatchHistoryDto[];
	friends: FriendsDto[];
	dms: DmDto[];
	dms_messages: DmMessageDto[];
	channels: ChannelDto[];
	channels_messages: ChannelMessageDto[];
	channels_users: ChannelUserDto[];
	latestTimeOnline: string;
}
