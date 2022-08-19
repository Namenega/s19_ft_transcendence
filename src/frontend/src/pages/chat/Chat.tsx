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

import Authentication from '../login/authentication';
import Profile from '../profile/UserAccount';
import './chatsView.css'
import { Button } from '@mui/material';


//const Chat = () => {

//    return (
//        <div className="chat-main-ctn">
//            <div className="chat-messages-ctn"></div>
//            <div className="chat-conversation-ctn"></div>
//        </div>
//    )
//}

/* ******************************** INTERFACES ****************************** */

interface addUsersProps {
	currentChat: ChannelDto,
	currentChatLatestUpdates: () => void
}

interface channelViewUsersProps {
	channelUser: ChannelUserDto,
	changeUser: (newUser: UserDto | null) => void,
	currentChat: ChannelDto,
	currentChatLatestUpdates: () => void,
	changeViewProfile: (profile: UserDto) => void
}

interface channelSettingsprops {
	channelUser: ChannelUserDto,
	changeCurrentChat: (newChat: DmDto | ChannelDto | null) => void,
	currentChat: ChannelDto,
	password: string,
	type: string,
	changePassword: (newValue: string) => void,
	changeType: (newValue: "public" | "private" | "password" | '') => void,
	resetSettings: () => void,
	changeSettings: (newValue: boolean) => void
}

interface channelInfoProps {
	channelUser: ChannelUserDto,
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
	const [searchText, setSearchText] = useState<string>('');

	const isPartOfUsers: (account: UserDto) => boolean = (account) => {
		const find = currentChat.users.find((user) => user.id === account.id);
		return (find !== undefined);
	}

	const handleSearch: (searchValue: string) => void = async (searchValue) => {
		let search: UserDto[] = [];
		const allUsers = await getAllUsers();

		allUsers.forEach((item) => searchValue.length !== 0 && !isPartOfUsers(item) &&
			item.login.includes(searchValue) && search.push(item))
		setSearchText(searchValue);
		setSearchResults(search);
	}

	const onSubmit: (id: number) => void = async (id) => {
		let user = await getCompleteUser(id);
		if (user === null) return ;
		user.channels = [...user.channels, currentChat];
		await addUser(user); //updateUser should be used but bugs... Thus addUser which calls save is used as it can update too if element already exists... And it works!!
		await addChannelUser(createNewChannelUser(currentChat, user, false, false));
		handleSearch('');
    	currentChatLatestUpdates();
	}

	return (
		<div> This is chat return 1 </div>
	)

	// return (
	// 	<div>
	// 		This is Chat return 1
	// 		<br />
	// 		<input className="textInput" placeholder={"Add users..."} type="text" value={searchText}
	// 				onChange={(e) => handleSearch(e.target.value)}/>
	// 		<br />
	// 		{searchResults.map((item) =>
	// 			<div>
	// 				<br/>
	// 				<span>{item.login}</span><>&nbsp;&nbsp;</>
	// 				<Button variant="contained" onClick={(e)=> {onSubmit(item.id)}}>Add User</Button>
	// 			</div>)
	// 		}
	// 	</div>
	// );

	// return (<div>
	// 	<br/>
	// 	<input className={cs.textInput} placeholder={"Add users..."} type="text" value={searchText} onChange={(e) => handleSearch(e.target.value)}/><br/>
	// 	{searchResults.map((item) => <div>
	// 									<br/>
	// 									<span>{item.login}</span><>&nbsp;&nbsp;</>
	// 									<button className={styles.addUserButton} onClick={(e)=> {onSubmit(item.id)}}>Add User</button>
	// 								 </div>)}
	//   </div>);
}

/***************************/

const ChannelViewUsers: React.FC<channelViewUsersProps> = ({ channelUser, changeUser, currentChat, currentChatLatestUpdates, changeViewProfile }) => {
	const changeStatus: (id: number, newValue: boolean) => void = async (id, newValue) => {
		await updateChannelUser(id, { administrator: newValue });
		currentChatLatestUpdates();
	}

	const ban: (target: ChannelUserDto) => void = async (target) => {
		currentChat.users = currentChat.users.filter((item: UserDto) => item.id !== target.user.id);
		currentChat.channel_users = currentChat.channel_users.filter((channelUser: ChannelUserDto) => channelUser.id !== target.id);
		await addChannel(currentChat); //updateChannel should be used but bugs... Thus addChannel which calls save is used as it can update too if element already exists... And it works!!
		await currentChatLatestUpdates();
	}

	const mute: (id: number, newValue: boolean) => void = async (id, newValue) =>  {
		await updateChannelUser(id, { mute: newValue });
		currentChatLatestUpdates();
	}

	return (
		<div>
			This is Chat return 2
		</div>
	)

// 	return (<>
// 		<AddUsers currentChat={currentChat} currentChatLatestUpdates={currentChatLatestUpdates}/>
// 		<h3>Users</h3>
// 			{currentChat.channel_users.length === 1 ? <p>No other users</p> :
// 				currentChat.channel_users.map((item: ChannelUserDto) => {
// 					if (item.user.id === channelUser.user.id) return "";
// 					if (item.owner) return (<span onClick={()=>changeViewProfile(item.user)}><span className={cs.clickable}>{item.user.login}</span><span>{" --- owner"}</span><br/><br/></span>);
// 					return (<div>
// 											<span className={cs.clickable} onClick={()=>changeViewProfile(item.user)}>{item.user.login}</span><span>{" --- " + (item.administrator ? "administrator" : "user") + (item.mute ? " --- mute   " : "   ")}</span>
// 											{channelUser.owner && <button className={styles.changeStatusButton} onClick={(e)=>changeStatus(item.id, !item.administrator)}>Change Status</button>}
// 											{(channelUser.owner || (channelUser.administrator && !item.administrator)) && <button className={styles.banButton} onClick={(e)=>ban(item)}>Ban</button>}
// 											{(channelUser.owner || (channelUser.administrator && !item.administrator)) && <button className={styles.muteButton} onClick={(e)=>mute(item.id, !item.mute)}>{item.mute ? "Unmute" : "mute"}</button>}
// 									<br/><br/></div>);
// 				})
// 			}
//   </>);
}

/***************************/

const ChannelSettings: React.FC<channelSettingsprops> = ({ channelUser, changeCurrentChat, currentChat, password, type, changePassword, changeType, resetSettings, changeSettings }) => {
	const onSubmitChannel: () => void = async () => {
		if (type === "password" && password === '')
			return ;
		currentChat.type = type;
		currentChat.password = password;
		await updateChannel(currentChat.id, {type: type, password: password});
		changeCurrentChat(currentChat);
		changeSettings(false);
		resetSettings();
	}

	return (
		<div>
			This is Chat return 3
		</div>
	)

// 	return (<>
// 		<br/><br/>
// 		<label className={type === "public" ? cs.radioButtonOn : cs.radioButton}>public
// 			<input type="radio" name="channeltype" onChange={()=>changeType("public")} required/>
// 		</label>
// 		<>&nbsp;&nbsp;&nbsp;</>
// 		<label className={type === "private" ? cs.radioButtonOn : cs.radioButton}>private
// 			<input type="radio" name="channeltype" onChange={()=>changeType("private")} required/>
// 		</label>
// 		<>&nbsp;&nbsp;&nbsp;</>
// 		<label className={type === "password" ? cs.radioButtonOn : cs.radioButton}>password
// 			<input type="radio"name="channeltype" onChange={()=>changeType("password")} required/>
// 		</label>
// 		<br/><br/>
// {type === "password" && <><input className={cs.textInput} placeholder={"Password..."} type="password" maxLength={20} value={password} onChange={(e)=>changePassword(e.target.value)} required/><br/><br/></>}
// <input className={cs.submitButton} type="submit" onClick={()=>onSubmitChannel()}/>
// <br/><br/>
// </>)
}

/***************************/

const ChannelInfo: React.FC<channelInfoProps> = ({ channelUser, changeUser, changeCurrentChat, currentChat, currentChatLatestUpdates, changeViewProfile }) => {
	const [info, setInfo] = useState<boolean>(false);
	const [viewUsers, setViewUsers] = useState<boolean>(false);
	const [settings, setSettings] = useState<boolean>(false);
	const [type, setType] = useState<"public" | "private" | "password" | ''>('');
	const [password, setPassword] = useState<string>('');

	const resetSettings: () => void = () => {
		setPassword('');
		setType('');
	}

	const changeSettings: (newValue: boolean) => void = (newValue) => {
		if (newValue === true) currentChatLatestUpdates();
		setSettings(newValue);
	}

	const changeViewUsers: (newValue: boolean) => void = (newValue) => {
		if (newValue === true) currentChatLatestUpdates();
		setViewUsers(newValue);
	}

	const changeInfo: (newValue: boolean) => void = (newValue) => {
		if (newValue === true) currentChatLatestUpdates();
		setInfo(newValue);
	}

	const changeType: (newValue: "public" | "private" | "password" | '') => void = (newValue) => {
		setType(newValue);
	}

	const changePassword: (newValue: string) => void = (newValue) => {
		setPassword(newValue);
	}

	return (
		<div>
			This is Chat return 4
		</div>
	)

	// return (<div>
	// 	<button className={!info ? styles.channelInfoButton : styles.channelInfoButtonOn} onClick={()=>{changeInfo(!info); changeSettings(false); changeViewUsers(false); resetSettings();}}>Info</button><>&nbsp;&nbsp;</>
	// 				<button className={!viewUsers ? styles.usersButton : styles.usersButtonOn} onClick={()=>{changeViewUsers(!viewUsers); changeSettings(false); changeInfo(false); resetSettings();}}>Users</button><>&nbsp;&nbsp;</>
	// 	{channelUser.owner === true && <button className={!settings ? styles.settingsButton : styles.settingsButtonOn} onClick={()=>{changeSettings(!settings); changeInfo(false); changeViewUsers(false); resetSettings();}}>Settings</button>}
	// 	{info && <ul>
	// 			  <li><span style={{color:"#507255"}}>{`Type: `}</span><span style={{color:"#4AAD52"}}>{currentChat.type}</span></li>
	// 			  <li><span style={{color:"#507255"}}>{`Owner: `}</span><span style={{color:"#4AAD52"}}>{currentChat.channel_users.find((channel_user: ChannelUserDto) => channel_user.owner === true)!.user.login}</span></li>
	// 			  {/* {currentChat.type === "password" && <li>{`Password: ${currentChat.password}`}</li>} */}
	// 			  {!channelUser.owner && channelUser.administrator && <li><span style={{color:"#507255"}}>You are an </span><span style={{color:"#4AAD52"}}>administrator</span></li>}
	// 			</ul>}
	// 	{settings && <ChannelSettings channelUser={channelUser} changeCurrentChat={changeCurrentChat} currentChat={currentChat} password={password} type={type} changePassword={changePassword} changeType={changeType} resetSettings={resetSettings} changeSettings={changeSettings}/>}
	// 	{viewUsers && <ChannelViewUsers channelUser={channelUser} changeUser={changeUser} currentChat={currentChat} currentChatLatestUpdates={currentChatLatestUpdates} changeViewProfile={changeViewProfile}/>}
	//   </div>);
}

/***************************/

const Message: React.FC<messageProps> = ({ userOrchannelUser, currentChat, currentChatLatestUpdates, dm, socket, currUser }) => {
	const [message, setMessage] = useState<string>('');
	const Maps = ['black', 'white', 'winter', 'summer', 'night'];

	useEffect(() => currentChatLatestUpdates(), []);

	const submitMessage: () => void = async () => {
		await currentChatLatestUpdates();
		if (dm)
			await addDmMessage(createNewDmMessage(userOrchannelUser, currentChat, message, currentChat.messages.length + 1));
		else
			await addChannelMessage(createNewChannelMessage(userOrchannelUser.user, currentChat, message, currentChat.messages.length + 1));
		setMessage('');
		send(socket, {room: currentChat.id, content: "new message"});
		await currentChatLatestUpdates();
	}

	const createGame: (message: ChannelMessageDto | DmMessageDto, game: {speed: number, map: string, random: boolean}) => void = async (message, game) => {
		let userMessage = await getUser(message.user.id);
		if (userMessage !== null && userMessage.id !== (dm ? userOrchannelUser.id : userOrchannelUser.user.id) && userMessage.status === "Online") {
			if (game.random) {
				game.speed = Math.floor(Math.random() * 3) + 1;
				game.map = Maps[Math.floor(Math.random() * 5)];
			}
			await addGame({user1: userMessage, user2: (dm ? userOrchannelUser : userOrchannelUser.user), ballspeed: game.speed, map: game.map});
		}
		dm ? await updateDmMessage(message.id, {content: "/*PLAY*"}) : await updateChannelMessage(message.id, {content: "/*PLAY*"});
		await currentChatLatestUpdates();
	}

	const ChatMessage: React.FC<{message: ChannelMessageDto | DmMessageDto}> = ({message}) => {
		let game = {speed: 1, map: "black", random: false};

		const ChatCommands: React.FC<{}> = () => {
			if (message.content.substring(0,6) === "*PLAY*") {
				if (message.content.substring(7,13) === "random") {
					game.random = true;
					return(<div>This is Chat return 5</div>)
					// return (<><span>{`random game --- `}</span><button className={styles.playRandomButton} onClick={()=>createGame(message, game)}>PLAY</button></>)
				} else if (message.content.length > 6) {
					game.speed = Number(message.content.substring(7,8));
					game.map = message.content.substring(9, message.content.length);
					if (!(game.speed > 0 && game.speed < 4) || !(Maps.find((_map: string) => _map === game.map))) return <></>;
					return(<div>This is Chat return 6</div>)
					// return (<><span>{`speed: ${game.speed} map: ${game.map} --- `}</span><button className={styles.playCustomButton} onClick={()=>createGame(message, game)}>PLAY</button></>)
				}
				return(<div>This is Chat return 7</div>)
				// return (<><span>{`speed: ${game.speed} map: ${game.map} --- `}</span><button className={styles.playDefaultButton} onClick={()=>createGame(message, game)}>PLAY</button></>)
			} else if (message.content === "/*PLAY*") { //If game is finished change message so that score is appended to it and show it in the chat!!!!!!!!!
				return(<div>This is Chat return 8</div>)
				// return (<><button className={styles.playDisabledButton} disabled>PLAY</button></>)
			} else {
				return(<div>This is Chat return 9</div>)
				// return (<span>{message.content}</span>);
			}
		}
		return(<div>This is Chat return 10</div>)

		// return (<>
		// 	<div className={message.user.id === currUser ? cs.currUserChatMessageClass : cs.chatMessageClass}>
		// 		<div className={cs.chatUserNameClass}>
		// 			{`${message.user.login}`}
		// 		</div>
		// 		<div className={cs.chatUserMessageClass}>
		// 			<ChatCommands/>
		// 		</div>
		// 	</div>
		// 	<br/>
		// 	<br/>
		// 	</>); //css jules
	// }
	}

	return (
		<div>
			This is Chat return 11
		</div>
	)

// 	return (<>
// 		<div className={cs.chatMessageBoxClass}>
// 		<h2 className={cs.chatTitle}>Messages</h2><br/>
// {currentChat.messages.map((message: ChannelMessageDto | DmMessageDto)=><ChatMessage message={message}/>)}
// 		<br/>
// <input className={cs.textInput} type="text" value={message} onChange={(e)=>setMessage(e.target.value)}/>
// {((dm && currentChat.block) || (!dm && userOrchannelUser.mute)) && <input className={styles.messageDisabledButton} type="submit" value="Message" disabled/>}
// 		{((dm && !currentChat.block) || (!dm && !userOrchannelUser.mute)) && <input className={styles.messageButton} type="submit" value="Message" onClick={(e)=>submitMessage()}/>}
// 		</div>
// </>);
}

/***************************/

const Chat: React.FC<chatProps> = ({ user, changeUser, currentChat, changeCurrentChat, changeGame, logout }) => {
	let dm: boolean = ("block" in currentChat);
	const [socket, setSocket] = useState<any>(null);
	const [viewProfile, setViewProfile] = useState<UserDto | undefined>(undefined);

	useEffect(() => {
		const connectedSocket = connect()
		setSocket(connectedSocket);
		joinRoom(connectedSocket, currentChat.id);
		listen(connectedSocket, async (response: string) => {
			if (response === "new message")
				await currentChatLatestUpdates();
		});
		return () => {
			leaveRoom(connectedSocket, currentChat.id);
			disconnect(connectedSocket);
		}
	}, [])

	//constant cjeck if the user has been banned/muted
	useEffect(() => {
		const interval = setInterval(currentChatLatestUpdates, 2000);
		return () => clearInterval(interval);
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
		await currentChatLatestUpdates();
		currentChat.block = !currentChat.block;
		if  (currentChat.block === true)
			currentChat.user_id_who_initiated_blocking = user.id;
		await addDm(currentChat);
		changeCurrentChat(currentChat);
	}

	const leaveChannel: () => void = async () => {
		await currentChatLatestUpdates();
		currentChat.users = currentChat.users.filter((channelUser: UserDto) => channelUser.id !== user.id);
		currentChat.channels_users = currentChat.channel_users.filter((channelUser: ChannelUserDto) => channelUser.user.id !== user.id);
		await addChannel(currentChat);
		if (currentChat.users.length === 0) {
			await removeChannel(currentChat.id);
			changeCurrentChat(null);
			return ;
		}
		if (currentChat.channel_users.find((channel_user: ChannelUserDto) => channel_user.owner === true)
		=== undefined) {
			let newOwner: ChannelUserDto | undefined = currentChat.channel_users.find((channel_user: ChannelUserDto) => channel_user.administrator === true);
			if (newOwner === undefined)
				newOwner = currentChat.channel_users[0];
			await updateChannelUser(newOwner!.id, {owner: true, administrator: true});
		}
		changeCurrentChat(null);
	}

	const changeViewProfile: (profile: UserDto) => void = (profile) => {
		setViewProfile(profile);
	}

	const backFromViewProfile: () => void = () => {
		setViewProfile(undefined);
	}

	if (viewProfile !== undefined)
		return <Profile user={viewProfile} changeUser={changeUser} back={backFromViewProfile}
			myAccount={false} changeGame={changeGame} logout={logout}/>;

	//MODIFY
	return (
		<div className='chat-extension-ctn'>
			<h2 className='chat-title'>Chat</h2>
		</div>
	)

	// return (<div className={cs.chatRootClass}>
	// 	<button className={cs.backButton} onClick={()=>changeCurrentChat(null)}>Back</button>
	// 	{dm && (!currentChat.block || (currentChat.block && currentChat.user_id_who_initiated_blocking === user.id))
	// 					&& <><>&nbsp;&nbsp;</><button className={styles.blockButton} onClick={()=>setBlock()}>{currentChat.block === false ? "Block" : "Unblock"}</button></>}
	// 	{!dm && <><>&nbsp;&nbsp;</><button className={styles.leaveChannelButton} onClick={()=>leaveChannel()}>Leave</button></>}
	// 				{dm && <h1 className={cs.clickable} onClick={()=>changeViewProfile(currentChat.users.find((userDm: UserDto) => userDm.id !== user.id))}> {currentChat.users.find((userDm: UserDto) => userDm.id !== user.id).login}</h1>}
	// 	{!dm && <h1> {currentChat.name}</h1>}
	// 	{!dm && <ChannelInfo channelUser={currentChat.channel_users.find((channelUser: ChannelUserDto)=> channelUser.user.id === user.id)} changeUser={changeUser} changeCurrentChat={changeCurrentChat} currentChat={currentChat} currentChatLatestUpdates={currentChatLatestUpdates} changeViewProfile={changeViewProfile}/>}
	// 				<br/>
	// 	<Message userOrchannelUser={dm ? user : currentChat.channel_users.find((channelUser: ChannelUserDto)=> channelUser.user.id === user.id)} currentChat={currentChat} currentChatLatestUpdates={currentChatLatestUpdates} dm={dm} socket={socket} currUser={user.id}/>
	//   </div>);
}

export default Chat
