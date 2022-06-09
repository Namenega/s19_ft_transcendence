import { UserDto } from "../../api/user/dto/user.dto";

let g_viewed_users_history: UserDto[] = [];

interface profileProps {
	user: UserDto,
	changeUser: (newUser: UserDto | null) => void,
	back: () => void,
	myAccount: boolean,
	// changeGame: (newgame: GameDto | null) => void
}

interface settingsProps {
	user: UserDto,
	changeUser: (newUser: UserDto | null) => void,
	renderPage: () => void
}

interface FriendsProps {
	profile: UserDto,
	changeProfile: (newProfile: UserDto) => void,
	ownAccount: boolean,
	changeAccountOwner: (newValue: boolean) => void,
}

interface FindFriendsProps {
	profile: UserDto,
	userFriends: UserDto[],
	renderFriends: () => void
}


const Profile: React.FC<profileProps> =
		({user, changeUser, back, myAccount}) => {
	return (
		<div className="chat-conversation-ctn">
			Bonjour
		</div>
	);
}
export default Profile;
