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
import { AppBar, Box, Button, Divider, IconButton, List, ListItem, ListItemText, Stack, TextField, Toolbar, Typography } from "@mui/material"
import { Filter, Filter1Outlined } from "@mui/icons-material"
import MenuIcon from '@mui/icons-material/Menu';


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
	back: () => void
}

const JoinChannel: React.FC<joinChannelProps> = ({ user, channels, changeCurrentChat }) => {
	const [searchResults, setSearchResults] = useState<ChannelDto[]>([]);
	const [searchText, setSearchText] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	
	const isPartOfChannels: (channel: ChannelDto) => boolean = (channel) => {
		//!ENLEVER LE TERNAIRE ET REMETTRE LIGNE EN DESSOUS
		// https://bobbyhadz.com/blog/javascript-cannot-read-property-find-of-undefined
		// const finder = channels.find((myChannel) => myChannel.name === channel.name);
		const finder = channels ? channels.find((myChannel) => myChannel.name === channel.name) : undefined;

		// CHECK FINDER (A ENLEVER)
		console.log(finder);

		return (finder !== undefined);
	}
	
	const handleSearch: (searchValue: string) => void = async (searchValue) => {
		let search: ChannelDto[] = [];
		const allChannels = await getAllChannels();
		
		allChannels.forEach((item) => searchValue.length !== 0 && item.type !== "private"
			&& !isPartOfChannels(item) && item.name.includes(searchValue) && search.push(item))
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
		<div className='chat-extension-ctn'>
			<h2 className='chat-title'>Join channel</h2>

		</div>
	);
	
	// return (
	// 	<div>
	// 		<br/>
	// 		<input className="textInput" placeholder={"Search channel..."} type="text" value={searchText}
	// 			onChange={(e) => handleSearch(e.target.value)}/>
	// 		<br/>
	// 		{searchResults.map((item) =>
	// 			<div>
	// 				<br/>
	// 				<span>{item.name}</span><>&nbsp;&nbsp;</>
	// 				{item.type === "password" && <><input className="textInput" placeholder={"Password..."} type="password" value={password}
	// 						onChange={(e)=>setPassword(e.target.value)}/><>&nbsp;&nbsp;</></>}
	// 				<Button variant="contained" className="startChannelButton" onClick={(e)=>{onSubmit(item)}}>
	// 					Join
	// 				</Button>
	// 				<br/>
	// 			</div>)}
	// 	</div>
	// );

	// return (<div>
	// 			<br/>
	// 			<input className={cs.textInput} placeholder={"Search channel..."} type="text" value={searchText} onChange={(e) => handleSearch(e.target.value)}/><br/>
	// 			{searchResults.map((item) =>
	// 				<div>
	// 					<br/>
	// 					<span>{item.name}</span><>&nbsp;&nbsp;</>
	// 					{item.type === "password" && <><input className={cs.textInput} placeholder={"Password..."} type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/><>&nbsp;&nbsp;</></>}
	// 					<button className={styles.startChannelButton} onClick={(e)=>{onSubmit(item)}}>Join</button><>&nbsp;&nbsp;</>
	// 				</div>)}
	// 		</div>);
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
		<div className='chat-extension-ctn'>
			<h2 className='chat-title'>New channel</h2>

		</div>
	);
	
	// return (<div>
	// 			<br/>
	// 			<label>Channel name: </label>
	// 			<br/><br/>
	// 			<input className="textInput" type="text" maxLength={20}
	// 				value={name} name="channelname"
	// 				onChange={(e)=>setName(e.target.value)} required/>
	// 			<br/><br/>
	// 			<input type="radio" name="channeltype" onChange={()=>setType("public")} required/>
	// 			<Button variant="contained"
	// 					sx={{margin: 1}}
	// 					color={type === "public" ? "secondary" : "primary"}>public</Button>
	// 			<br/>
	// 			<input type="radio" name="channeltype" onChange={()=>setType("private")} required/>
	// 			<Button variant="contained"
	// 					sx={{margin: 1}}
	// 					color={type === "private" ? "secondary" : "primary"}>private</Button>
	// 			<br/>
	// 			<input type="radio" name="channeltype" onChange={()=>setType("password")} required/>
	// 			<Button variant="contained"
	// 					sx={{margin: 1}}
	// 					color={type === "password" ? "secondary" : "primary"}>password</Button>
	// 			{type === "password" &&
	// 				<>
	// 					<input className="textInput" placeholder={"Password..."}
	// 						type="password" maxLength={20} value={password}
	// 						onChange={(e)=>setPassword(e.target.value)}/>
	// 				</>
	// 			}
	// 			<br/><br/>
	// 			{nameAlreadyInUse && <p>Name already exists, try another one.</p> && <br/>}
	// 			<Button variant="contained" type="submit"
	// 					onClick={()=>onSubmit(createNewChannel([user], name, type, password))}>
	// 				Submit
	// 			</Button>
	// 			<br/><br/>
	// 		</div>);


//   return (<div>
// 				<br/>
// 				<label>Channel name: </label>
// 				<input className={cs.textInput} type="text" maxLength={20} value={name} name="channelname" onChange={(e)=>setName(e.target.value)} required/><br/><br/>
// 				<label className={type === "public" ? cs.radioButtonOn : cs.radioButton}>public
// 					<input type="radio" name="channeltype" onChange={()=>setType("public")} required/>
// 							  </label>
// 							  <>&nbsp;&nbsp;&nbsp;</>
// 				<label className={type === "private" ? cs.radioButtonOn : cs.radioButton}>private
// 					<input type="radio" name="channeltype" onChange={()=>setType("private")} required/>
// 							  </label>
// 							  <>&nbsp;&nbsp;&nbsp;</>
// 				<label className={type === "password" ? cs.radioButtonOn : cs.radioButton}>password
// 					<input type="radio"name="channeltype" onChange={()=>setType("password")} required/>
// 							  </label>
// 							  <br/><br/>
// 				{type === "password" && <><input className={cs.textInput} placeholder={"Password..."} type="password" maxLength={20} value={password} onChange={(e)=>setPassword(e.target.value)}/><br/><br/></>}
//			 	{nameAlreadyInUse && <p>Name already exists try another one</p>}
//			 	<button className={cs.submitButton} type="submit" onClick={()=>onSubmit(createNewChannel([user], name, type, password))}>Submit</button>
// 			</div>)
}

const NewDm: React.FC<newDmProps> = ({ user, dms, changeCurrentChat }) => {
	const [searchResults, setSearchResults] = useState<UserDto[]>([]);
	const [searchText, setSearchText] = useState<string>('');
	const [showResult, setResult] = useState<boolean>(false);

	const isPartOfDms: (account: UserDto) => boolean = (account) => {
		//!ENLEVER LE TERNAIRE ET REMETTRE LIGNE EN DESSOUS
		// https://bobbyhadz.com/blog/javascript-cannot-read-property-find-of-undefined
		// const finder = dms.find((dm) => dm.users.some((user) => user.id === account.id));
		const finder = dms ? dms.find((dm) => dm.users.some((user) => user.id === account.id)) : undefined;

		// CHECK FINDER
		console.log(finder);

		return (finder !== undefined);
	}

	const handleSearch: (searchValue: string) => void = async (searchValue) => {
		let search: UserDto[] = [];
		const allUsers = await getAllUsers();

		console.log(allUsers)
		console.log(searchValue)
		console.log(isPartOfDms(allUsers[1]))

		allUsers.forEach((item) => searchValue.length !== 0 && !isPartOfDms(item)
				&& item.login.includes(searchValue) && item.login !== user.login && search.push(item) && console.log(item.login))
		setSearchText(searchValue);
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
				{showResult && searchResults.map((item) => <div>
				<br/>
				<span>{item.login}</span><>&nbsp;&nbsp;</>
				<Button variant='outlined' onClick={(e)=> {onSubmit(item)}}>
					Submit
				</Button>
				<br/><br/>
				<Divider variant="middle" />
				</div>)}
			</div>
	);

  	// return (<div>
	// 			<br/>
	// 			<input className="textInput" placeholder={"Search user..."} type="text" value={searchText}
	// 				onChange={(e) => handleSearch(e.target.value)}/>
	// 			<br/><br/>
	// 			{searchResults.map((item) =>
	// 				<div>
	// 					<br/>
	// 					<span>{item.login}</span><>&nbsp;&nbsp;</>
	// 					<Button className="startDmButton" variant="contained" onClick={(e)=> {onSubmit(item)}}>DM</Button>
	// 				</div>)}
	// 		</div>
	// );

//   return (<div>
// 		<br/>
// 		<input className={cs.textInput} placeholder={"Search user..."} type="text" value={searchText} onChange={(e) => handleSearch(e.target.value)}/><br/>
// 		{searchResults.map((item) => <div>
// 									<br/>
// 									<span>{item.login}</span><>&nbsp;&nbsp;</>
// 									<button className={styles.startDmButton} onClick={(e)=> {onSubmit(item)}}>DM</button>
// 								 </div>)}
//   	</div>);

}

const ChatsView: React.FC<chatsViewProps> = ({ user, changeUser, changeMenuPage, changeGame, back }) => {
	const [newdm, setNewdm] = useState<boolean>(false);
	const [newchannel, setNewchannel] = useState<boolean>(false);
	const [joinchannel, setJoinchannel] = useState<boolean>(false);
	const [viewChatCommands, setViewChatCommands] = useState<boolean>(false);
	const [directMessage, setDms] = useState<DmDto[]>([]);
	const [channels, setChannels] = useState<ChannelDto[]>([]);
	const [currentChat, setCurrentChat] = useState<DmDto | ChannelDto | null>(null);

	// useEffect(() => getChats(), [currentChat]);															c'est ca qui fait blank screen
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
		setNewchannel(false);
		setNewdm(false);
		setJoinchannel(false);
		setCurrentChat(newChat);
	}

	const isLogout = () => {
		window.location.href = 'http://localhost:3000'
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
					<Button variant="contained" color="primary" onClick={() => isLogout()}>Logout</Button>
					</Toolbar>
				</AppBar>
			</Box>
			<div className='chat-main-ctn'>
				<div className='chat-ctn'>
					<h2 className='chat-title'>Message</h2>
						<Stack spacing={2}>
							<Button variant="contained" onClick={()=> {setNewdm(!newdm); setNewchannel(false); setJoinchannel(false); setViewChatCommands(false);}}>
								New DM
							</Button>
							{/* GO TO NEWDM IF CLICK ON "NEW DM" BUTTON */}
							<Button variant="contained" onClick={()=>{setNewchannel(!newchannel); setNewdm(false); setJoinchannel(false); setViewChatCommands(false);}}>
								New Channel
							</Button>
							<Button variant="contained" onClick={()=> {setJoinchannel(!joinchannel); setNewchannel(false); setNewdm(false); setViewChatCommands(false);}}>
								Join Channel
							</Button>
							<Button variant="contained" onClick={()=> {setViewChatCommands(!viewChatCommands); setNewchannel(false); setNewdm(false); setJoinchannel(false);}}>
								Chat Commands
							</Button>
						</Stack>
				</div>
				{newdm && <NewDm user={user} dms={directMessage} changeCurrentChat={changeCurrentChat}/>}
				{newchannel && <NewChannel user={user} changeCurrentChat={changeCurrentChat}/>}
				{joinchannel && <JoinChannel user={user} channels={channels} changeCurrentChat={changeCurrentChat}/>}
			</div>
		</div>
		);


		{/* // 		return (<div className={cs.chatRootClass}>
		// 			<button className={cs.backButton} onClick={()=>{changeMenuPage('home')}}>Back</button>
		// 							<h1>Chat</h1>
		// 			<button className={!newdm ? styles.newDmButton : styles.newDmButtonOn} onClick={()=> {setNewdm(!newdm); setNewchannel(false); setJoinchannel(false); setViewChatCommands(false);}}>New DM</button><>&nbsp;&nbsp;</>
		// 			<button className={!newchannel ? styles.newChannelButton : styles.newChannelButtonOn} onClick={()=>{setNewchannel(!newchannel); setNewdm(false); setJoinchannel(false); setViewChatCommands(false);}}>New Channel</button><>&nbsp;&nbsp;</>
		// 			<button className={!joinchannel ? styles.joinChannelButton : styles.joinChannelButtonOn} onClick={()=> {setJoinchannel(!joinchannel); setNewchannel(false); setNewdm(false); setViewChatCommands(false);}}>Join Channel</button><>&nbsp;&nbsp;</>
		// 							<button className={!viewChatCommands ? styles.viewChatCommandsButton : styles.viewChatCommandsButtonOn} onClick={()=> {setViewChatCommands(!viewChatCommands); setNewchannel(false); setNewdm(false); setJoinchannel(false);}}>Chat Commands</button>
		// 			{newdm && <NewDm user={user} dms={dms} changeCurrentChat={changeCurrentChat}/>}
		// 			{newchannel && <NewChannel user={user} changeCurrentChat={changeCurrentChat}/>}
		// 			{joinchannel && <JoinChannel user={user} channels={channels} changeCurrentChat={changeCurrentChat}/>}
		// 			{viewChatCommands && <><br/><br/><span style={{color:"#507255"}}>Propose to play a default game: </span><span style={{color:"#4AAD52"}}>*PLAY*</span>
		// 								<br/><br/><span style={{color:"#507255"}}>Play a random game: </span><span style={{color:"#4AAD52"}}>*PLAY* random</span>
		// 								<br/><br/><span style={{color:"#507255"}}>Play a game with custom settings: </span><span style={{color:"#4AAD52"}}>*PLAY* 3 night</span><br/></>}
		// 			<br/><br/>
		// 			<h3>Active Chats</h3>
		// 			{channels.map((item)=><p className={cs.clickable} onClick={()=>changeCurrentChat(item)}>{`${item.name} -- channel`}</p>)}
		//----------------------------------------------------- DONE UP
		// 							{dms.map((item)=><p className={cs.clickable} onClick={()=>changeCurrentChat(item)}>{`${item.users[0].id === user.id ? item.users[1].login : item.users[0].login} -- dm`}</p>)}
		// 							{!channels.length && !dms.length && <p>No chats</p>}
		// 		  </div>);
		// }
		//} */}
}

export default ChatsView;
