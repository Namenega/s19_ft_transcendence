

interface joinChannelProps {
	user: UserDto,
	channels: ChannelDto[],
	changeCurrentChat: (newChat: DmDto | ChannelDto | null) => void
}

interface newChannelProps {
	user: UserDto,
	changeCurrentChat: (newChat: DmDto | ChannelDto | null) => void
}

interface newDmProps {
	user: UserDto,
	dms: DmDto[],
	changeCurrentChat: (newChat: DmDto | ChannelDto | null) => void
}

interface chatsViewProps {
	user: UserDto,
	changeUser: (newUser: UserDto | null) => void,
	changeMenuPage: (newMenuPage: string) => void,
	changeGame: (newGame: GameDto | null) => void
}

const JoinChannel: React.FC<joinChannelProps> = ({ user, channels, changeCurrentChat }) => {
	const [searchResults, setSearchResults] = useState<ChannelDto[]>([]);
	const [searchText, setSearchText] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	
	const isPartOfChannels: (channel: ChannelDto) => boolean = (channel) => {
		const find = channels.find((myChannel) => myChannel.name === channel.name);
		return (find !== undefined);
	}
	
	const handleSearch: (searchValue: string) => void = async (searchValue) => {
		let search: ChannelDto[] = [];
		const allChannels = await getAllChannels();
		
		allChannels.forEach((item) => searchValue.length !== 0 && item.type !== "private"
			&& !isPartOfChannels(item) && item.name.includes(searchValue)
		setSearchText(searchValue);
		setSearchResults(search);
	}
	
	const onSubmit: (channel: ChannelDto) => void = async (channel) => {
		if (channel.type === "password" &&
				!(await channelPasswordVerification(channel.id, password))) {
			setPassword('');
			return ;
		}
		channel.users = [...channel.users, user]
		await addChannel(channel)
		await addChannelUser(createNewChannelUser(channel, user, false, false));
		changeCurrentChat((await getChannel(channel.id)));
	}
	
	return (
		<div> THIS IS JOINCHANNEL() </div>
	);
}

const NewChannel: React.FC<newChannelProps> = ({ user, changeCurrentChat }) => {
	const [name, setName] = useState<string>('');
	const [type, setType] = useState<"public" | "private" | "password" | "">('');
	const [password, setPassword] = useState<string>('');
	const [nameAlreadyInUse, setNameAlreadyInUse] = useState<boolean>(false);
	
	const onSubmit: (newChannel: CreateChannelDto) => void = async (newChannel) => {
		if (newChannel.name === '' || newChannel.type === '' ||
				(newChannel.type === 'password' && newChannel.password === ""))
			return ;
		const allChannels = await getAllChannels();
		
		if (allChannels.some((channel) => channel.name === newChannel.name)) {
			setName('');
			setNameAlreadyInUse(true);
		} else {
			let NewChannel: ChannelDto = await addChannel(newChannel);
			await addChannelUser(createNewChannelUser(NewChannel, user, true, true));
			changeCurrentChat((await getChannel(NewChannel.id)));
		}
	}
	
	return (
		<div> THIS IS NEWCHANNEL() </div>
	);
}

const NewDm: React.FC<newDmProps> = ({ user, dms, changeCurrentChat }) => {
	const [searchResults, setSearchResults] = useState<UserDto[]>([]);
	const [searchText, setSearchText] = useState<string>('');
	
	const isPartOfDms: (account: UserDto) => boolean = (account) => {
		const find = dms.find((dm) => dm.users.some(user) => user.id === account.id));
		return (find !== undefined);
	}

	const handleSearch: (searchValue: string) => void = async (searchValue) => {
		let search: UserDto[] = [];
		const allUsers = await getAllUsers();
		
		allUsers.forEach((item => searchValue.length !== 0 && !isPartOfDms(item)
			&& item.login.includes(searchValue) && item.login !== user.login
			&& search.push(item)
		setSearchText(searchValue);
		setSearchResults(search);
	}
	
	const onSubmit: (user2: UserDto) => vooid = async (user2) => {
		const newDm: CreateDmDto = createNewDm(user, user2);
		const NewDm: DmDto = await addDm(newDm);
		
		changeCurrentChat(NewDm);
	}
	
	return (
		<div> THIS IS NEWDM() </div>
	);
}

const ChatsView: React.FC<chatsViewProps> = ({ user, changeUser, changeMenuPage, changeGame }) => {
	const [newdm, setNewdm] = useState<boolean>(false);
	const [newchannel, setNewchannel] = useState<boolean>(false);
	const [joinchannel, setJoinchannel] = useState<boolean>(false);
	const [viewChatCommands, setViewChatCommands] = useState<boolean>(false);
	const [dms, setDms] = useState<DmDto[]>([]);
	const [channels, setChannels] = useState<ChannelDto[]>([]);
	const [currentChat, setCurrentChat] = useState<DmDto | ChannelDto | null>(null);

	useEffect(() => getChats(), [currentChat]);
	useEffect(() => {
		const interval = setInterval(getChats, 2000);
		return () => clearInterval(interval);
		// eslint-disable-next-line
	}, [])
	
	const getChats: () => void = async () => {
		const completeUser = await getCompleteUser(user.id);
		if (completeUser === null)
			return ;
		if (_.isEqual(completeUser.dms, dms) && _.isEqual(completeuser.channels, channels))
			return ;
		if (currentChat !== null && !("block" in currentChat) &&
				completeUser!.channels.find((channel: ChannelDto) =>
				id.channel === currentChat.id) === undefined)
			changeCurrentChat(null);
		if (currentChat !== null && ("block" in currentChat) &&
				completeUser!.dms.find((dm: DmDto) =>
				dm.id === currentChat.id) === undefined)
			changeCurrentChat(null);
		setDms(completeuser!.dms);
		setChannels(completeUser!.channels);
	}
	
	const changeCurrentChat: (newChat: DmDto | ChannelDto | null) => void = (newChat) => {
		setNewCHannel(false);
		setNewDm(false);
		setJoinchannel(false);
		setCurrentChat(newChat);
	}
	
	if (currentChat !== null)
		return (<Chat user={user} changeUser={changeUser} changeCurrentChat={changeCurrentChat} currentChat={currentChat} changegame={changeGame}/>);
	else {
		return (
			<div> THIS IS CHATSVIEW() </div>
		);
	}
}
export default ChatsView;







