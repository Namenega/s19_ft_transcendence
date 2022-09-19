import React, { useState, useEffect } from 'react';
import _ from 'underscore';
import { connect, listen, joinRoom, leaveRoom, send, disconnect } from "../../socket/chat/chat.socket";
import { addChannel, removeChannel, updateChannel, updateChannelUser, getChannel, addChannelMessage, createNewChannelMessage, addChannelUser, createNewChannelUser, updateChannelMessage } from "../../api/channel/channels.api";
import { ChannelDto } from '../../api/channel/dto/channel.dto';
import { ChannelUserDto } from '../../api/channel/dto/channel_user.dto';
import { ChannelMessageDto } from "../../api/channel/dto/channel_message.dto";
import { addDm, getDm, addDmMessage, createNewDmMessage, updateDmMessage } from "../../api/dms/dms.api";
import { DmDto } from '../../api/dms/dto/dm.dto';
import { DmMessageDto } from "../../api/dms/dto/dm_message.dto";
import { addGame } from "../../api/games/games.api";
import { GameDto } from '../../api/games/dto/game.dto';
import { getAllUsers, addUser, getCompleteUser, getUser } from "../../api/user/user.api";
import { UserDto } from "../../api/user/dto/user.dto";
import './chatsView.css'
import { Avatar, Box, Button, ButtonGroup, Card, CardContent, Checkbox, FormControlLabel, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';

/* ******************************** INTERFACES ****************************** */

interface addUsersProps {
	currentChat: ChannelDto,
	currentChatLatestUpdates: () => void
}

interface channelViewUsersProps {
	channelUser: any,
	changeUser: (newUser: UserDto | null) => void,
	currentChat: ChannelDto,
	currentChatLatestUpdates: () => void,
	changeViewProfile: (profile: UserDto) => void
}

interface channelSettingsprops {
	channelUser: any,
	changeCurrentChat: (newChat: DmDto | ChannelDto | null) => void,
	currentChat: ChannelDto,
	currentChatLatestUpdates: () => void
}

interface channelInfoProps {
	channelUser: any,
	changeUser: (newUser: UserDto | null) => void,
	changeCurrentChat: (newChat: DmDto | ChannelDto | null) => void,
	currentChat: ChannelDto,
	currentChatLatestUpdates: () => void,
	changeViewProfile: (profile: UserDto) => void
}

interface messageProps {
	userOrchannelUser: any,
	currentChat: any, //type narrowing does not function correctly and typescript gives faulty type errors back, use any to avoid typescript type checking
	currentChatLatestUpdates: () => void,
	dm: boolean,
	socket: any,
	currUser: any;
}

interface chatProps {
	setShowOptions: any,
	showOptions: boolean,
	user: UserDto,
	changeUser: (newUser: UserDto | null) => void,
	currentChat: any, //type narrowing does not function correctly and typescript gives faulty type errors back, use any to avoid typescript type checking
	changeCurrentChat: (newChat: DmDto | ChannelDto | null) => void,
	changeGame: (newGame: GameDto | null) => void,
	logout: () => void
}

/* ****************************** FUNCTIONS ****************************** */

const AddUsers: React.FC<addUsersProps> = ({ currentChat, currentChatLatestUpdates }) => {
	const [searchResults, setSearchResults] = useState<UserDto[]>([]);

	const isPartOfUsers: (account: UserDto) => boolean = (account) => {
		const find = currentChat.users.find((user) => user.id === account.id);
		return (find !== undefined);
	}

	const handleSearch: (searchValue: string) => void = async (searchValue) => {
		let search: UserDto[] = [];
		const allUsers = await getAllUsers();

		allUsers.forEach((item) => searchValue.length !== 0 && !isPartOfUsers(item) &&
			item.login.includes(searchValue) && search.push(item))
		setSearchResults(search);
	}

	const onSubmit: (id: number) => void = async (id) => {
		let user = await getCompleteUser(id);
		if (user === null) return ;
		user.channels = [...user.channels, currentChat];
		await addUser(user); //updateUser should be used but bugs... Thus addUser which calls save is used as it can update too if element already exists... And it works!!
		addChannelUser(createNewChannelUser(currentChat, user, false, false));
		handleSearch('');
    	currentChatLatestUpdates();
	}

	return (
		<div>
			<Stack spacing={1}>
				<TextField id="outlined-basic" label="Search user" variant="standard" onChange={(e) => handleSearch(e.target.value)}>
				</TextField>
			</Stack>
			{searchResults.map((item, key) => <div key={key}>
			<br/>
			<span>{item.login}</span><>&nbsp;&nbsp;</>
			<Button variant='outlined' onClick={(e)=> {onSubmit(item.id)}}>
				Add user
			</Button>
			</div>)}
		</div>
	);
}

/***************************/

const ChannelViewUsers: React.FC<channelViewUsersProps> = ({ channelUser, changeUser, currentChat, currentChatLatestUpdates, changeViewProfile }) => {

	const changeStatus: (id: number, newValue: boolean) => void = async (id, newValue) => {
		updateChannelUser(id, { administrator: newValue });
		currentChatLatestUpdates();
	}

	const ban: (target: ChannelUserDto) => void = async (target) => {
		currentChat.users = currentChat.users.filter((item: UserDto) => item.id !== target.user.id);
		currentChat.channel_users = currentChat.channel_users.filter((channelUser: ChannelUserDto) => channelUser.id !== target.id);
		await addChannel(currentChat); //updateChannel should be used but bugs... Thus addChannel which calls save is used as it can update too if element already exists... And it works!!
		currentChatLatestUpdates();
	}

	const mute: (id: number, newValue: boolean) => void = async (id, newValue) =>  {
		updateChannelUser(id, { mute: newValue });
		currentChatLatestUpdates();
	}

	let bruh = currentChat.channel_users.find((channelUsr: ChannelUserDto)=> channelUsr.user.id === channelUser.id);

	return (<>
		<AddUsers currentChat={currentChat} currentChatLatestUpdates={currentChatLatestUpdates}/>
		<h3>Users</h3>
			{currentChat.channel_users.length === 1 ? <p>No other users</p> :
				currentChat.channel_users.map((item: ChannelUserDto) => {
					if (item.user.id === bruh!.user.id)
						return "";
					if (item.owner)
						return (<span key={item.id} onClick={()=>changeViewProfile(item.user)}><span>{item.user.login}</span><span>{" [owner]"}</span><br/><br/></span>);
					return (<div key={item.id}>
								<span onClick={()=>changeViewProfile(item.user)}>{item.user.login}</span><span>{" [" + (item.administrator ? "admin" : "user") + "]" + (item.mute ? " [mute] " : " ")}</span>
								<ButtonGroup>
									{bruh!.owner && <Button onClick={(e)=>changeStatus(item.id, !item.administrator)}>{item.administrator ? "User" : "Admin"}</Button>}
									{(bruh!.owner || (bruh!.administrator && !item.administrator)) && <Button onClick={(e)=>ban(item)}>ban</Button>}
									{(bruh!.owner || (bruh!.administrator && !item.administrator)) && <Button onClick={(e)=>mute(item.id, !item.mute)}>{item.mute ? "Unmute" : "mute"}</Button>}
								</ButtonGroup>
							<br/><br/></div>);
					})
			}
  </>);
}
/***************************/

const ChannelSettings: React.FC<channelSettingsprops> = ({ channelUser, changeCurrentChat, currentChat, currentChatLatestUpdates }) => {
	const [type, setType] = useState<"public" | "private" | "password" | ''>('');
	const [password, setPassword] = useState<string>('');

	const resetSettings: () => void = () => {
		setPassword('');
		setType('');
	}

	const changeSettings: (newValue: boolean) => void = (newValue) => {
		if (newValue === true) currentChatLatestUpdates();
	}

	const onSubmitChannel: () => void = async () => {
		if (type === "password" && password === '')
			return ;
		currentChat.type = type;
		currentChat.password = password;
		updateChannel(currentChat.id, {type: type, password: password});
		changeCurrentChat(currentChat);
		changeSettings(false);
		resetSettings();
	}

	if (type === "")
	{
		if (currentChat.type === "public")
			setType("public");
		else if (currentChat.type === "private")
			setType("private");
		else if (currentChat.type === "password")
			setType("password");
	}

	return (
		<Stack spacing={2}>
			<FormControlLabel label="Public" control={<Checkbox checked={type === "public"} disabled={type === "public"} onChange={()=>setType("public")}/>}/>
			<FormControlLabel label="Private" control={<Checkbox checked={type === "private"} disabled={type === "private"} onChange={()=>setType("private")}/>}/>
			<FormControlLabel label="Password" control={<Checkbox checked={type === "password"} disabled={type === "password"} onChange={()=>setType("password")}/>}/>
			{type === "password" && <TextField id="outlined-required" label="password" variant="outlined" placeholder="Required" inputProps={{maxLength: 20}} disabled={currentChat.type === "password"} value={password} onChange={(e)=>setPassword(e.target.value)}/>}
			<Button variant="contained" onClick={()=>onSubmitChannel()}>
				Submit
			</Button>
		</Stack>
	);
}

/***************************/

const ChannelInfo: React.FC<channelInfoProps> = ({ channelUser, changeUser, changeCurrentChat, currentChat, currentChatLatestUpdates, changeViewProfile }) => {
	const [infos, setInfos] = useState<boolean>(true);

	let bruh = currentChat.channel_users.find((channelUsr: ChannelUserDto)=> channelUsr.user.id === channelUser.id);

	return (<div>
		<Card sx={{ width: '100%', minWidth: 360 }}>
			{infos &&
			<CardContent>
				<List sx={{ display: "flex", flexDirection: "column", width: '100%', minWidth: 360, maxWidth: 360, maxHeight: 500, overflow: 'auto' }}>
					<ListItem>
						<ListItemText sx={{display: "flex"}}>
							<span style={{color:"#507255"}}>{`Type: `}</span><span style={{color:"#4AAD52"}}>{currentChat.type}</span>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText sx={{display: "flex"}}>
							<span style={{color:"#507255"}}>{`Owner: `}</span><span style={{color:"#4AAD52"}}>{currentChat.channel_users.find((channel_user: ChannelUserDto) => channel_user.owner === true)!.user.login}</span>
						</ListItemText>
					</ListItem>
					{!bruh!.owner && bruh!.administrator && 
					<ListItem>
						<ListItemText sx={{display: "flex"}}>
							<span style={{color:"#507255"}}>You are an </span><span style={{color:"#4AAD52"}}>administrator</span>
						</ListItemText>
					</ListItem>
					}
				</List>
			</CardContent>
			}
			{!infos &&
				<CardContent>
					<ChannelSettings channelUser={channelUser} changeCurrentChat={changeCurrentChat} currentChat={currentChat} currentChatLatestUpdates={currentChatLatestUpdates}/>
				</CardContent>
			}
		</Card>
		<br/>
		{bruh!.owner === true && <Button variant="contained" onClick={()=>{setInfos(!infos)}}>Settings</Button>}
	  </div>);
}

/***************************/

const Message: React.FC<messageProps> = ({ userOrchannelUser, currentChat, currentChatLatestUpdates, dm, socket, currUser }) => {
	const [message, setMessage] = useState<string>('');
	const Maps = ['black', 'white', 'winter', 'summer', 'night'];
	const [render, setRender] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(true);

	useEffect(() => { currentChatLatestUpdates()}
	// eslint-disable-next-line
	, []);

	
	const submitMessage: () => void = async () => {
		currentChatLatestUpdates();
		if (dm)
		{
			if (currentChat.block)
				return ;
			addDmMessage(createNewDmMessage(userOrchannelUser, currentChat, message, currentChat.messages.length + 1));
		}
		else
		{
			let wow = await currentChat.channel_users.find((channelUser: ChannelUserDto)=> channelUser.user.id === currUser);
			if (wow.mute)
				return ;
			addChannelMessage(createNewChannelMessage(wow.user, currentChat, message, currentChat.messages.length + 1));
		}
		setMessage('');
		send(socket, {room: currentChat.id, content: "new message"});
		currentChatLatestUpdates();
	}

	const createGame: (message: ChannelMessageDto | DmMessageDto, game: {speed: number, map: string, random: boolean}) => void = async (message, game) => {
		let userMessage = await getUser(message.user.id);
		let wow = await currentChat.channel_users.find((channelUser: ChannelUserDto)=> channelUser.user.id === currUser);
		if (userMessage !== null && userMessage.id !== (dm ? userOrchannelUser.id : wow.user.id) && userMessage.status === "Online") {
			if (game.random) {
				game.speed = Math.floor(Math.random() * 3) + 1;
				game.map = Maps[Math.floor(Math.random() * 5)];
			}
			await addGame({user1: userMessage, user2: (dm ? userOrchannelUser : wow.user), ballspeed: game.speed, map: game.map});
		}
		dm ? updateDmMessage(message.id, {content: "/*PLAY*"}) : updateChannelMessage(message.id, {content: "/*PLAY*"});
		currentChatLatestUpdates();
	}

	const keyPress: (e: any) => void = (e) => {
		if(e.keyCode === 13)
		{
			submitMessage();
			setMessage("");
		}
	}

	const ChatMessage: React.FC<{render: boolean, message: ChannelMessageDto | DmMessageDto}> = ({render, message}) => {
		let game = {speed: 1, map: "black", random: false};

		useEffect(() => {
			if (!render && (message.user !== null) && (message.user !== undefined))
				setRender(true);
		}
		// eslint-disable-next-line
		, [message.user]);

		const ChatCommands: React.FC<{}> = () => {
			async function disable()
			{
				await currentChatLatestUpdates();
				setDisabled(message.user === undefined || message.user.id === currUser || message.user.status !== "Online" ? true : false);
			}
			disable();
			if (message.content.substring(0,6) === "*PLAY*") {
				if (message.content.substring(7,13) === "random")
				{
					game.random = true;
					return (<><span>{`random game --- `}</span><Button disabled={disabled} onClick={()=>createGame(message, game)}>PLAY</Button></>)
				}
				else if (message.content.length > 6)
				{
					game.speed = Number(message.content.substring(7,8));
					game.map = message.content.substring(9, message.content.length);
					if (!(game.speed > 0 && game.speed < 4) || !(Maps.find((_map: string) => _map === game.map)))
						return <></>;
					return (<><span>{`speed: ${game.speed} map: ${game.map} --- `}</span><Button disabled={disabled} onClick={()=>createGame(message, game)}>PLAY</Button></>)
				}
				return (<><span>{`speed: ${game.speed} map: ${game.map} --- `}</span><Button disabled={disabled} onClick={()=>createGame(message, game)}>PLAY</Button></>)
			}
			else if (message.content === "/*PLAY*")
			{
				return (<><Button disabled>PLAY</Button></>)
			}
			else
			{
				return (<span>{message.content}</span>);
			}
		}

		return (
			<div>
				{render && `${message.user.name}`}
				<br/>
				<ChatCommands/>	
			</div>
		);
	}
	return (
		<div>
			<Card>
				<CardContent>
					<List sx={{ display: "flex", flexDirection: "column", width: '100%', minWidth: 360, maxWidth: 360, minHeight: 500, maxHeight: 500, overflow: 'auto' }}>
					{currentChat.messages.length ? currentChat.messages.map((message: ChannelMessageDto | DmMessageDto)=>
						<ListItem>
							<ListItemText sx={{display: "flex"}}>
								<ChatMessage render={render} message={message}/>
							</ListItemText>
						</ListItem>
						) : <p>No messages</p>}
					</List>
				</CardContent>
			</Card>
			<br/>
			<TextField label="Message" value={message} onKeyDown={(e)=>keyPress(e)} onChange={(e)=>setMessage(e.target.value)}/>
		</div>
	)
}

/***************************/

const Chat: React.FC<chatProps> = ({ setShowOptions, showOptions, user, changeUser, currentChat, changeCurrentChat, changeGame, logout }) => {
	let dm: boolean = (currentChat && "block" in currentChat);
	const [socket, setSocket] = useState<any>(null);
	const [viewProfile, setViewProfile] = useState<UserDto | undefined>(undefined);
	const [channelExt, setChannelExt] = useState<"info" | "messages" | "user">("messages");
	// eslint-disable-next-line
	const [showInfos, setShowInfos] = useState<boolean>(true);

	useEffect(() => {
		const connectedSocket = connect()
		setSocket(connectedSocket);
		joinRoom(connectedSocket, currentChat.id);
		listen(connectedSocket, async (response: string) => {
			if (response === "new message")
				currentChatLatestUpdates();
		});
		return () => {
			leaveRoom(connectedSocket, currentChat.id);
			disconnect(connectedSocket);
		}
		// eslint-disable-next-line
	}, []);

	//constant check if the user has been banned/muted
	useEffect(() => {
		const interval = setInterval(currentChatLatestUpdates, 2000);
		return () => clearInterval(interval);
		// eslint-disable-next-line
	}, []);

	const currentChatLatestUpdates: () => void = async () => {
		let latestChat: any;

		if (dm)
			latestChat = await getDm(currentChat.id);
		else
		 	latestChat = await getChannel(currentChat.id);
		if (_.isEqual(latestChat, currentChat))
			return ;
		if (latestChat === null
		|| latestChat.users.find((item: UserDto) => item.id === user.id) === undefined
		|| (!dm && latestChat.channel_users.find((channel_user: ChannelUserDto) => channel_user.owner
		=== true) === undefined)) {
			changeCurrentChat(null);
			return ;
		}
		changeCurrentChat(latestChat);
	}

	const setBlock: () => void = async () => {
		currentChatLatestUpdates();
		currentChat.block = !currentChat.block;
		if  (currentChat.block === true)
			currentChat.blockerUserId = user.id;
		await addDm(currentChat);
		changeCurrentChat(currentChat);
	}

	const leaveChannel: () => void = async () => {
		currentChatLatestUpdates();
		currentChat.channel_users = currentChat.channel_users.filter((channelUser: ChannelUserDto) => channelUser.user.id !== user.id);
		currentChat.users = currentChat.users.filter((channelUser: UserDto) => channelUser.id !== user.id);
		await addChannel(currentChat);
		if (currentChat.users.length === 0) {
			removeChannel(currentChat.id);
			changeCurrentChat(null);
			return ;
		}
		if (currentChat.channel_users.find((channel_user: ChannelUserDto) => channel_user.owner === true)
		=== undefined) {
			let newOwner: ChannelUserDto | undefined = currentChat.channel_users.find((channel_user: ChannelUserDto) => channel_user.administrator === true);
			if (newOwner === undefined)
				newOwner = currentChat.channel_users[0];
			updateChannelUser(newOwner!.id, {owner: true, administrator: true});
		}
		changeCurrentChat(null);
	}

	const changeViewProfile: (profile: UserDto) => void = (profile) => {
		setShowOptions(false);
		setViewProfile(profile);
	}

	if (viewProfile !== undefined)
		return (
			<div className='chat-extension-ctn'>
					<Button onClick={() => {setViewProfile(undefined); setShowOptions(true)}} >Close</Button>
					<h2 className='chat-title'>Profile</h2>
					<Stack spacing={2}>
							<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
								<Avatar sx={{ width: 100, height: 100}} src={viewProfile.avatar} />
							</Box>
							<Card>
								<CardContent>
									<Typography variant="h5" component="div">
										{viewProfile.name}
									</Typography>
									<Typography variant="h5" component="div" color="text.secondary">
										{viewProfile.login}
									</Typography>
								</CardContent>
							</Card>
							<Card sx={{ minWidth: 350 }}>
								{showInfos &&
								<CardContent>
        							<Typography variant="h5" component="div">
										Status
									</Typography>
									<Typography sx={{ fontSize: 14 }} color={viewProfile.status === "Offline" ? {color: "red"} : {color: "green"}} gutterBottom>
										{viewProfile.status}
									</Typography>
									<Typography variant="h5" component="div">
										Ratio
									</Typography>
									<Typography sx={{ fontSize: 14 }} color="text.secondary">
										{(`${viewProfile.numberOfWin} / ${viewProfile.numberOfLoss}`) ? (`${viewProfile.numberOfWin} / ${viewProfile.numberOfLoss}`) : 0}
									</Typography>
									<Typography variant="h5" component="div">
										Wins
									</Typography>
									<Typography sx={{ fontSize: 14 }} color="text.secondary">
										{viewProfile.numberOfWin}
									</Typography>
									<Typography variant="h5" component="div">
										Losses
									</Typography>
									<Typography sx={{ fontSize: 14 }} color="text.secondary">
										{viewProfile.numberOfLoss}
									</Typography>
								</CardContent>
								}
							</Card>
					</Stack>
				</div>
		);
	return (
		<div className='chat-extension-ctn'>
			<ButtonGroup>
				<Button onClick={()=>changeCurrentChat(null)}>Close</Button>
				{!dm && <><Button onClick={()=>leaveChannel()}>Leave</Button></>}
			</ButtonGroup>
			{dm && <br/>}
			{dm &&
			<ButtonGroup>
				{dm && <Button variant="outlined" onClick={()=>changeViewProfile(currentChat.users.find((userDm: UserDto) => userDm.id !== user.id))}> {currentChat.users.find((userDm: UserDto) => userDm.id !== user.id).login}</Button>}
				{dm && (!currentChat.block || (currentChat.block && currentChat.blockerUserId === user.id)) && <Button variant="contained" onClick={()=>setBlock()}>{currentChat.block === false ? "Block" : "Unblock"}</Button>}
			</ButtonGroup>
			}
			{!dm && <h1> {currentChat.name}</h1>}
			{!dm &&
			<ButtonGroup variant="contained" aria-label="outlined button group">
				<Button onClick={()=>{setChannelExt("messages")}}>Messages</Button>
				<Button onClick={()=>{setChannelExt("info")}}>Info</Button>
				<Button onClick={()=>{setChannelExt("user")}}>Users</Button>
			</ButtonGroup>
			}
			<br/>
			{channelExt === "messages" && <Message userOrchannelUser={user} currentChat={currentChat} currentChatLatestUpdates={currentChatLatestUpdates} dm={dm} socket={socket} currUser={user.id}/>}
			{channelExt === "info" && <ChannelInfo channelUser={user} changeUser={changeUser} changeCurrentChat={changeCurrentChat} currentChat={currentChat} currentChatLatestUpdates={currentChatLatestUpdates} changeViewProfile={changeViewProfile}/>}
			{channelExt === "user" && <ChannelViewUsers channelUser={user} changeUser={changeUser} currentChat={currentChat} currentChatLatestUpdates={currentChatLatestUpdates} changeViewProfile={changeViewProfile}/>}
		</div>
	)
}

export default Chat
