import React, { useState, useEffect } from 'react';
import { UserDto } from "../api/user/dto/user.dto";



//const Chat = () => {

//    return (
//        <div className="chat-main-ctn">
//            <div className="chat-messages-ctn"></div>
//            <div className="chat-conversation-ctn"></div>
//        </div>
//    )
//}

const Chat: React.FC<chatProps> = ({ user, changeUser, currentChat, changeCurrentChat, changeGame }) => {
	let dm: boolean = ("block" in currentChat);
	const [socket, setSocket] = useState<any>(null);
	const [viewProfile, setViewProfile] = useState<UserDto | undefined>(undefined);

	useEffect(() => {
		const connectedSocket = connect()
		setSocket(connectedSocket);
		joinRoom(connectedSocket, currentChat.id);
		listen(connectedSocket, async (response: string) => {
			if (reponse === "new message")
				await CurrentChatLatestUpdates();
		});
		return () => {
			leaveRoom(connectedSocket, currentChat.id);
			disconnect(connectedSocket);
		}
	}, [])

	//constant cjeck if the user has been banned/muted
	useEffect(() = {
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
		|| (!dm && latestChat.channel_users.find((channel_user: ChanneluserDto) => channel_user.owner
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

	if (viewProfile !=== undefined)
		return <Profile user={viewProfile} changeUser={changeUser} back={backFromViewProfile}
			myAccount={false} changeGame={changeGame}/>;

	//MODIFY
	return (
		<div className="chat-main-ctn">
			<div className="chat-messages-ctn"></div>
			<div className="chat-conversation-ctn"></div>
		</div>
	)
}

export default Chat
