import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import _ from "underscore"
import { find } from "underscore"
import { addChannel, addChannelUser, channelPasswordVerification, createNewChannelUser, getAllChannels, getChannel } from "../../api/channel/channels.api"
import { ChannelDto } from "../../api/channel/dto/channel.dto"
import { CreateChannelDto } from "../../api/channel/dto/create-channel.dto"
import { addDm, createNewDm } from "../../api/dms/dms.api"
import { CreateDmDto } from "../../api/dms/dto/create-dm.dto"
import { DmDto } from "../../api/dms/dto/dm.dto"
import { GameDto } from "../../api/games/dto/game.dto"
import { UserDto } from "../../api/user/dto/user.dto"
import { getAllUsers, getCompleteUser } from "../../api/user/user.api"
import Chat from "../Chat"


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
			&& !isPartOfChannels(item) && item.name.includes(searchValue))
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
		const find = dms.find((dm) => dm.users.some((user) => user.id === account.id));
		return (find !== undefined);
	}

  const handleSearch: (searchValue: string) => void = async (searchValue) => {
    let search: UserDto[] = [];
		const allUsers = await getAllUsers();

    allUsers.forEach((item) => searchValue.length !== 0 && !isPartOfDms(item)
                            && item.login.includes(searchValue) && item.login !== user.login && search.push(item))
    setSearchText(searchValue);
    setSearchResults(search);
  }

  const onSubmit: (user2: UserDto) => void = async (user2) => {
			const newDm: CreateDmDto = createNewDm(user, user2);
			const NewDm: DmDto = await addDm(newDm);
      changeCurrentChat(NewDm);
  }

  return (<div> THIS IS NEW DM </div>);
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
		if (_.isEqual(completeUser.dms, dms) && _.isEqual(completeUser.channels, channels))
			return ;
		if (currentChat !== null && !("block" in currentChat) &&
				completeUser!.channels.find((channel: ChannelDto) =>
				channel.id === currentChat.id) === undefined)
			changeCurrentChat(null);
		if (currentChat !== null && ("block" in currentChat) &&
				completeUser!.dms.find((dm: DmDto) =>
				dm.id === currentChat.id) === undefined)
			changeCurrentChat(null);
		setDms(completeUser!.dms);
		setChannels(completeUser!.channels);
	}
	
	const changeCurrentChat: (newChat: DmDto | ChannelDto | null) => void = (newChat) => {
		setNewchannel(false);
		setNewdm(false);
		setJoinchannel(false);
		setCurrentChat(newChat);
	}
	
	if (currentChat !== null)
		return (<Chat user={user} changeUser={changeUser} changeCurrentChat={changeCurrentChat} currentChat={currentChat} changeGame={changeGame}/>);
	else {
		return (
			<div className='home-main-ctn'>
				<Box textAlign='center'>
					<AppBar position="static">
						<Toolbar >
							<Typography variant="h6" component="div">
								Transcendence
							</Typography>
							<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
								<Button variant="contained" sx={{marginTop: '20px', marginLeft: '10px'}} onClick={()=>{changeMenuPage('home')}}> Back </Button>
								<Button variant="contained" sx={{marginTop: '20px', marginLeft: '10px'}} onClick={()=>{changeMenuPage('game')}}> Game </Button>
								<Button variant="contained" sx={{marginTop: '20px', marginLeft: '10px'}} onClick={()=>{changeMenuPage('profile')}}> Profile </Button>
								<Button variant="contained" sx={{marginTop: '20px', marginLeft: '10px'}} onClick={()=>{changeMenuPage('watch')}}> Watch </Button>
							</Box>
						</Toolbar>
					</AppBar>
				</Box>
				<div className='listamis'> this is </div>
			</div>
		);
// 		return (<div className={cs.chatRootClass}>
// 			<button className={cs.backButton} onClick={()=>{changeMenuPage('home')}}>Back</button>
// 							<h1>Chat</h1>
// 			<button className={!newdm ? styles.newDmButton : styles.newDmButtonOn} onClick={()=> {setNewdm(!newdm); setNewchannel(false); setJoinchannel(false); setViewChatCommands(false);}}>New DM</button><>&nbsp;&nbsp;</>
// 			<button className={!newchannel ? styles.newChannelButton : styles.newChannelButtonOn} onClick={()=>{setNewchannel(!newchannel); setNewdm(false); setJoinchannel(false); setViewChatCommands(false);}}>New Channel</button><>&nbsp;&nbsp;</>
// 			<button className={!joinchannel ? styles.joinChannelButton : styles.joinChannelButtonOn} onClick={()=> {setJoinchannel(!joinchannel); setNewchannel(false); setNewdm(false); setViewChatCommands(false);}}>Join Channel</button><>&nbsp;&nbsp;</>
// 							<button className={!viewChatCommands ? styles.viewChatCommandsButton : styles.viewChatCommandsButtonOn} onClick={()=> {setViewChatCommands(!viewChatCommands); setNewchannel(false); setNewdm(false); setJoinchannel(false);}}>Chat Commands</button>
// 			{newdm && <NewDm user={user} dms={dms} changeCurrentChat={changeCurrentChat}/>}
// 			{newchannel && <NewChannel user={user} changeCurrentChat={changeCurrentChat}/>}
// 			{joinchannel && <JoinChannel user={user} channels={channels} changeCurrentChat={changeCurrentChat}/>}
// 							{viewChatCommands && <><br/><br/><span style={{color:"#507255"}}>Propose to play a default game: </span><span style={{color:"#4AAD52"}}>*PLAY*</span>
// 																	 <br/><br/><span style={{color:"#507255"}}>Play a random game: </span><span style={{color:"#4AAD52"}}>*PLAY* random</span>
// 																	  <br/><br/><span style={{color:"#507255"}}>Play a game with custom settings: </span><span style={{color:"#4AAD52"}}>*PLAY* 3 night</span><br/></>}
// 			<br/><br/>
// 							<h3>Active Chats</h3>
// 			{channels.map((item)=><p className={cs.clickable} onClick={()=>changeCurrentChat(item)}>{`${item.name} -- channel`}</p>)}
// 							{dms.map((item)=><p className={cs.clickable} onClick={()=>changeCurrentChat(item)}>{`${item.users[0].id === user.id ? item.users[1].login : item.users[0].login} -- dm`}</p>)}
// 							{!channels.length && !dms.length && <p>No chats</p>}
// 		  </div>);
// }
//}
	}
}
export default ChatsView;







