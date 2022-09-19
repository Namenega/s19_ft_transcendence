import { useEffect, useState } from "react"
import Chat from "./Chat"
import { addDm, createNewDm } from "../../api/dms/dms.api"
import { addChannel, addChannelUser, channelPasswordVerification, createNewChannelUser, getAllChannels, getChannel, createNewChannel } from "../../api/channel/channels.api"
import { getAllUsers, getCompleteUser } from "../../api/user/user.api"
import { UserDto } from "../../api/user/dto/user.dto"
import { DmDto } from "../../api/dms/dto/dm.dto"
import { ChannelDto } from "../../api/channel/dto/channel.dto"
import { CreateChannelDto } from "../../api/channel/dto/create-channel.dto"
import { CreateDmDto } from "../../api/dms/dto/create-dm.dto"
import { GameDto } from "../../api/games/dto/game.dto"
import _ from "underscore"
import './chatsView.css'
import { AppBar, Box, Button, Card, CardContent, Checkbox, Divider, FormControlLabel, IconButton, List, ListItem, ListItemButton, Stack, TextField, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import ForumIcon from '@mui/icons-material/Forum';


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
	changeGame: (newGame: GameDto | null) => void,
	back: () => void,
	logout: () => void
}

const JoinChannel: React.FC<joinChannelProps> = ({ user, channels, changeCurrentChat }) => {
	const [searchResults, setSearchResults] = useState<ChannelDto[]>([]);
	const [password, setPassword] = useState<string>('');
	const [showResult, setResult] = useState<boolean>(false);
	const [value, setValue] = useState<ChannelDto | null>(null);
	
	const isPartOfChannels: (channel: ChannelDto) => boolean = (channel) => {
		const finder = channels ? channels.find((myChannel) => myChannel.name === channel.name) : undefined;

		return (finder !== undefined);
	}
	
	const handleSearch: (searchValue: string) => void = async (searchValue) => {
		let search: ChannelDto[] = [];
		const allChannels = await getAllChannels();
		
		allChannels.forEach((item) => searchValue.length !== 0 && item.type !== "private"
			&& !isPartOfChannels(item) && item.name.includes(searchValue) && search.push(item))
		setSearchResults(search);
		setResult(true);
		setValue(null);
	}
	
	const onSubmit: (channel: ChannelDto | null) => void = async (channel) => {
		if (channel === null)
			return ;
		if (channel.type === "password" &&
				!(await channelPasswordVerification(channel.id, password))) {
			setPassword('');
			return ;
		}
		channel.users = [...channel.users, user]
		await addChannel(channel)
		addChannelUser(createNewChannelUser(channel, user, false, false));
		changeCurrentChat((await getChannel(channel.id)));
	}

	return (
		<div className='chat-extension-ctn'>
			<h2 className='chat-title'>Join channel</h2>
			<Stack spacing={1}>
				<TextField id="outlined-basic" label="Search channel" variant="standard" onChange={(e) => handleSearch(e.target.value)}>
				</TextField>
				{showResult && searchResults.map((item, key) => 
					<div key={key}>
						<br/>
						<Button onClick={() => setValue(item)}>{item.name}</Button><>&nbsp;&nbsp;</>
						<br/><br/>
						<Divider variant="middle" />
					</div>
				)}
				<br/>
				<TextField disabled={(!value || value.type !== "password") ? true : false} label="Password" id="outlined-required" placeholder="Required" onChange={(e)=>setPassword(e.target.value)}/>
				<br/>
				<Button variant='contained' disabled={!value} onClick={()=> {onSubmit(value)}}>
					Submit
				</Button>
			</Stack>
		</div>
	);
}

const NewChannel: React.FC<newChannelProps> = ({ user, changeCurrentChat }) => {
	const [name, setName] = useState<string>('');
	const [type, setType] = useState<"public" | "private" | "password" | "">('');
	const [password, setPassword] = useState<string>('');
	const [nameAlreadyInUse, setNameAlreadyInUse] = useState<boolean>(false);
	const [fillIn, setFillIn] = useState<boolean>(false);
	
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
			addChannelUser(createNewChannelUser(NewChannel, user, true, true));
			changeCurrentChat((await getChannel(NewChannel.id)));
		}
	}

	return (
		<div className='chat-extension-ctn'>
			<h2 className='chat-title'>New channel</h2>
			<Stack spacing={2}>
				<TextField id="outlined-required" label="Channel name" variant="outlined" placeholder="Required" inputProps={{maxLength: 20}} value={name} onChange={(e)=>setName(e.target.value)}/>
				<FormControlLabel label="Public" control={<Checkbox checked={type === "public"} onChange={()=>setType("public")}/>}/>
				<FormControlLabel label="Private" control={<Checkbox checked={type === "private"} onChange={()=>setType("private")}/>}/>
				<FormControlLabel label="Password" control={<Checkbox checked={type === "password"} onChange={()=>setType("password")}/>}/>
				{type === "password" && <TextField id="outlined-required" label="password" variant="outlined" placeholder="Required" inputProps={{maxLength: 20}} value={password} onChange={(e)=>setPassword(e.target.value)}/>}
				<Button type="submit" variant="contained" onClick={()=>{onSubmit(createNewChannel([user], name, type, password)); setFillIn(true)}}>Create</Button>
				{!nameAlreadyInUse && fillIn && name === "" && <p>Choose a channel name.</p>}
				{fillIn && type === "" && <p>Choose a channel type.</p>}
				{nameAlreadyInUse && <p>Name already exists, try another one.</p>}
			</Stack>
		</div>
	);
}

const NewDm: React.FC<newDmProps> = ({ user, dms, changeCurrentChat }) => {
	const [searchResults, setSearchResults] = useState<UserDto[]>([]);
	const [showResult, setResult] = useState<boolean>(false);

	const isPartOfDms: (account: UserDto) => boolean = (account) => {
		const finder = dms ? dms.find((dm) => dm.users.some((user) => user.id === account.id)) : undefined;

		return (finder !== undefined);
	}

	const handleSearch: (searchValue: string) => void = async (searchValue) => {
		let search: UserDto[] = [];
		const allUsers = await getAllUsers();

		allUsers.forEach((item) => searchValue.length !== 0 && !isPartOfDms(item)
				&& item.login.includes(searchValue) && item.login !== user.login && search.push(item))
		setSearchResults(search);
		showResultList();
	}

	const onSubmit: (user2: UserDto) => void = async (user2) => {
		const newDm: CreateDmDto = createNewDm(user, user2);
		const NewDm: DmDto = await addDm(newDm);

		changeCurrentChat(NewDm);
	}

	const showResultList: () => void = () => {
		setResult(true);
	}

	return (
			<div className='chat-extension-ctn'>
				<h2 className='chat-title'>New direct message</h2>
				<Stack spacing={1}>
					<TextField id="outlined-basic" label="Search user" variant="standard" onChange={(e) => handleSearch(e.target.value)}>
					</TextField>
				</Stack>
				{showResult && searchResults.map((item, key) => <div key={key}>
				<br/>
				<span>{item.login}</span><>&nbsp;&nbsp;</>
				<Button variant='outlined' onClick={()=> {onSubmit(item)}}>
					New dm
				</Button>
				<br/><br/>
				<Divider variant="middle" />
				</div>)}
			</div>
	);
}

const ChatsView: React.FC<chatsViewProps> = ({ user, changeUser, changeMenuPage, changeGame, back, logout }) => {
	const [newdm, setNewdm] = useState<boolean>(false);
	const [newchannel, setNewchannel] = useState<boolean>(false);
	const [joinchannel, setJoinchannel] = useState<boolean>(false);
	const [directMessage, setDms] = useState<DmDto[]>([]);
	const [channels, setChannels] = useState<ChannelDto[]>([]);
	const [currentChat, setCurrentChat] = useState<DmDto | ChannelDto | null>(null);
	const [showChat, setShowChat] = useState<boolean>(false);
	const [showOptions, setShowOptions] = useState<boolean>(true);

	useEffect(() => { getChats();},
	// eslint-disable-next-line
	[currentChat]);
	
	useEffect(() => {
		const interval = setInterval(getChats, 2000);
		return () => clearInterval(interval);
		// eslint-disable-next-line
	}, [])
	
	const getChats: () => void = async () => {
		const completeUser = await getCompleteUser(user.id);
		if (completeUser === null)
			return ;
		if (_.isEqual(completeUser.dms, directMessage) && _.isEqual(completeUser.channels, channels))
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
		if (newChat === null)
			setShowChat(false);
		setNewchannel(false);
		setNewdm(false);
		setJoinchannel(false);
		setCurrentChat(newChat);
	}

	return (
		<div className='full-chat-main-ctn'>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static" color="secondary">
					<Toolbar>
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => back()}>
						<MenuIcon/>
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						ft_transcendence
					</Typography>
					<Button variant="contained" color="primary" onClick={() => logout()}>Logout</Button>
					</Toolbar>
				</AppBar>
			</Box>
			<div className='chat-main-ctn'>
				<div className='chat-ctn'>
					<h2 className='chat-title'>Message</h2>
						<Stack spacing={2}>
							{showChat &&
							<Card>
								<CardContent>
									<Typography variant="body1" color="text.secondary" component="div">
										Chat commands
									</Typography>
									<Divider variant="middle" />
									<br/>
									<Typography variant="body2" component="div">
									<span>Propose to play a default game: </span><p/><span style={{color:"#4AAD52"}}>*PLAY*</span><p/>
									<span>Play a random game: </span><p/><span style={{color:"#4AAD52"}}>*PLAY* random</span><p/>
									<span>Play a game with custom settings: </span><p/><span style={{color:"#4AAD52"}}>*PLAY* 3 night</span>
									</Typography>
								</CardContent>
							</Card>
							}
							{!showChat && <>
								<Button variant="contained" onClick={()=> {setNewdm(!newdm); setNewchannel(false); setJoinchannel(false); setShowChat(false)}}>
									New DM
								</Button>
								<Button variant="contained" onClick={()=>{setNewchannel(!newchannel); setNewdm(false); setJoinchannel(false); setShowChat(false)}}>
									New Channel
								</Button>
								<Button variant="contained" onClick={()=> {setJoinchannel(!joinchannel); setNewchannel(false); setNewdm(false); setShowChat(false)}}>
									Join Channel
								</Button>
								</>
							}
							{!showChat &&
							<Card>
								<CardContent>
									<Typography variant="body1" color="text.secondary" component="div">
										Active chats
									</Typography>
								<Divider variant="middle" />
								{!channels.length && !directMessage.length && <p><br/>No chats</p>}
								<List sx={{ width: '100%', minWidth: 300, maxWidth: 300, minHeight: 250, maxHeight: 250, overflow: 'auto' }}>
									{channels.length !== 0 && channels.map((item, key)=> 
									<ListItem key={key}>
										<ListItemButton sx={{display: "flex", justifyContent: "center"}} onClick={()=> {changeCurrentChat(item); setShowChat(true)}}>
											{item.name}
										</ListItemButton>
										<IconButton aria-label="channel" onClick={()=> {changeCurrentChat(item); setShowChat(true)}}>
											<ForumIcon />
										</IconButton>
									</ListItem>
									)}
									{directMessage.length !== 0 && directMessage.map((item, key)=>
									<ListItem key={key}>
										<ListItemButton sx={{display: "flex", justifyContent: "center"}} onClick={()=> {changeCurrentChat(item); setShowChat(true)}}>
											{item.users[0].id === user.id ? item.users[1].login : item.users[0].login}
										</ListItemButton>
										<IconButton aria-label="channel" onClick={()=> {changeCurrentChat(item); setShowChat(true)}}>
											<ChatIcon/>
										</IconButton>
									</ListItem>
									)}
								</List>
								</CardContent>
							</Card>
							}
						</Stack>
				</div>
				{newdm && <NewDm user={user} dms={directMessage} changeCurrentChat={changeCurrentChat}/>}
				{newchannel && <NewChannel user={user} changeCurrentChat={changeCurrentChat}/>}
				{joinchannel && <JoinChannel user={user} channels={channels} changeCurrentChat={changeCurrentChat}/>}
				{showChat && <Chat setShowOptions={setShowOptions} showOptions={showOptions} user={user} changeUser={changeUser} currentChat={currentChat} changeCurrentChat={changeCurrentChat} changeGame={changeGame} logout={logout}/>}
			</div>
		</div>
		);
}

export default ChatsView;
