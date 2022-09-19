import { useEffect, useState } from "react";
import { CompleteMatchHistoryDto, MatchHistoryDto } from "../../api/match-history/dto/match-history.dto";
import { getMatchHistoryOfUser } from "../../api/match-history/match-history.api";
import { UserDto } from "../../api/user/dto/user.dto";
import { get2FASecret, getAllUsers, getUser, getUserByLogin, updateUser, verify2FA } from "../../api/user/user.api";
import _ from 'underscore';
import { FriendsDto } from "../../api/friends/dto/friends.dto";
import { addFriend, createNewFriend, getFriendsOfUser, removeFriend } from "../../api/friends/friends.api";
import './profile.css';
import QRCode from 'qrcode';
import { AppBar, Avatar, Button, IconButton, Stack, Toolbar, Typography, Card, ButtonGroup, TextField, FormControlLabel, Checkbox, CardContent, Divider, ListItem, List, ListItemAvatar, ListItemText } from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from '@mui/icons-material/Menu';

let g_viewed_users_history: UserDto[] = [];

interface profileProps {
	user: UserDto,
	changeUser: (newUser: UserDto | null) => void,
	back: () => void,
	myAccount: boolean,
	logout: () => void
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
	setExt: any
}

interface FindFriendsProps {
	profile: UserDto,
	userFriends: UserDto[],
	renderFriends: () => void
	changeFriendsPage: () => void
}

interface mhProps {
	user: UserDto,
}

const Settings: React.FC<settingsProps> = ({ user, changeUser, renderPage }) => {
	let [login, setLogin] = useState<string>('');
	let [loginAlreadyInUse, setLoginAlreadyInUse] = useState<boolean>(false);
	let [avatarTooBig, setAvatarTooBig] = useState<boolean>(false);
	let [qrcode, setQrcode] = useState<string>('');
	let [activate2FA, setActivate2FA] = useState<boolean>(user.has2FA);
	let [token, setToken] = useState<string>('');
	let [wrongToken, setWrongToken] = useState<boolean>(false);

	const newLogin: (name: string) => void = async (name) => {
		if (name === '') return ;
		let userInDatabaseByLogin = await getUserByLogin(login);
		if (userInDatabaseByLogin === null) {
			setLoginAlreadyInUse(false);
			user.login = name;
			changeUser(user);
			await updateUser(user.id, {login: name});
			setLogin('');
			renderPage();
		} else {
			setLoginAlreadyInUse(true);
			setLogin('');
		}
	}

	const changeTwoFactorAuthentication: () => void = async () => {
		activate2FA = !activate2FA;
		setActivate2FA(activate2FA);
		if (activate2FA) {
				const secret = await get2FASecret();
				QRCode.toDataURL(secret.otpauth_url, (err: any, url: any) => qrcode = url);
				await updateUser(user.id, {secret2FA: secret.ascii});
				user.secret2FA = secret.ascii;
		} else {
			await updateUser(user.id, {has2FA: false});
			user.has2FA = false;
			qrcode = '';
			setToken('');
			setWrongToken(false);
		}
		changeUser(user);
		renderPage();
		setQrcode(qrcode);
	}

	const verify2FAuth: () => void = async () => {
		setToken('');
		const correct = await verify2FA(user.secret2FA, token);
		if (correct) {
			setQrcode('');
			setWrongToken(false);
			updateUser(user.id, {has2FA: true});
			user.has2FA = true;
			changeUser(user);
			renderPage();

		} else {
			setWrongToken(true);
		}
	}

	const changeAvatar: (event: any) => void = async (event) => {
		setAvatarTooBig(false);
		if (!event.target.files) return ;
		if (event.target.files[0].size > 16384)
		{
			setAvatarTooBig(true);
			return ;
		}
		let reader = new FileReader();
	 	reader.onload = async (e) => {
			if (e === null || e!.target!.result === null) return ;
			updateUser(user.id, {avatar: e!.target!.result as string});
			user.avatar = e!.target!.result as string;
			changeUser(user);
			renderPage();
	 	};
	 	reader.readAsDataURL(event.target.files[0]);
 }

		const keyPress: (e: any) => void = (e) => {
			if(e.keyCode === 13){
				verify2FAuth();
			}
		}

 	return (
        <div className='extension-ctn'>
			<h2 className='profile-title'>Settings</h2>
			<Stack spacing={2}>
				<TextField inputProps={{maxLength: 15}} id="outlined-basic" label="New login" variant="outlined" onChange={(e)=>setLogin(e.target.value)}/>
				<Button variant="contained" type="submit" onClick={()=>newLogin(login)}>Submit</Button>
				{loginAlreadyInUse && <span>This login is already in use</span>}
				<Divider variant="middle" />
				<FormControlLabel control={<Checkbox checked={activate2FA} onChange={()=>changeTwoFactorAuthentication()}/>} label="Two Factor Authentication" />
				{qrcode !== '' && <img src={qrcode} alt={"QR code"}/>}
				{qrcode !== '' && <TextField label="Token" defaultValue={token} onKeyDown={(e)=>keyPress(e)} onChange={(e)=>setToken(e.target.value)}/>}
				{wrongToken && <span>Wrong Token</span>}
				<Divider variant="middle" />
				<Button component="label" className='game-button-text' variant="outlined"> 
					Change Avatar <input hidden type="file" accept="image/*" onChange={(e)=>changeAvatar(e)}/>
				</Button>
				{avatarTooBig && <p>Avatar too large</p>}
			</Stack>
        </div>
	);
}

const FindFriends: React.FC<FindFriendsProps> = ({ profile, userFriends, renderFriends, changeFriendsPage }) => {
	const [searchResults, setSearchResults] = useState<UserDto[]>([]);
	const [showResult, setResult] = useState<boolean>(false);

	const isPartOfFriends: (account: UserDto) => boolean = (account) => {
		const find = userFriends.find((friend) => account.id === friend.id);
		return (find !== undefined);
	}

  const handleSearch: (searchValue: string) => void = async (searchValue) => {
    let search: UserDto[] = [];
		const allUsers = await getAllUsers();

    allUsers.forEach((item) => searchValue.length !== 0 && !isPartOfFriends(item)
                              && item.login.includes(searchValue) && item.login !== profile.login && search.push(item))
    setSearchResults(search);
	showResultList();
  }

	const _addFriend: (item: UserDto) => void = async (item) => {
		addFriend(createNewFriend(profile, item.id));
		addFriend(createNewFriend(item, profile.id));
		handleSearch("");
		renderFriends();
	}

	const showResultList: () => void = () => {
		setResult(true);
	}

  	return (
  		<div>
			<Stack spacing={1}>
				<Button variant='contained' onClick={()=> changeFriendsPage()}>
					Friends list
				</Button>
				<TextField id="outlined-basic" label="Find Friends" variant="standard" onChange={(e) => handleSearch(e.target.value)}>
				</TextField>
			</Stack>
            {showResult && searchResults.map((item, key) => <div key={key}>
            <br/>
            <span>{item.login}</span><>&nbsp;&nbsp;</>
            <Button variant='outlined' onClick={()=> _addFriend(item)}>
				Add
			</Button>
			<br/><br/>
			<Divider variant="middle" />
            </div>)}
        </div>
	);
}

const Friends: React.FC<FriendsProps> = ({ profile, changeProfile, ownAccount, changeAccountOwner, setExt }) => {
	const [userFriends, setUserFriends] = useState<UserDto[]>([]);
	const [render, setRender] = useState<boolean>(true);
	const [searchF, setSearchF] = useState<boolean>(false);

	const getFriendFromId: (friend_id: number) => Promise<UserDto | null> = async (friend_id) => {
		const friend = await getUser(friend_id);
		if (friend === null) return null;
		return friend;
	}

	useEffect(() => {
		const getUserFriends: () => void = async () => {
			let friends: FriendsDto[] = await getFriendsOfUser(profile.login);
			let friends1: (UserDto | null)[] = await Promise.all(friends.map(async (item): Promise<UserDto | null> => { return await getFriendFromId(item.friendId); }));
			// @ts-ignore
			let friends2: UserDto[] = friends1.filter((friend) => friend !== null);
			if (_.isEqual(userFriends, friends2)) return ;
			setUserFriends(friends2);
		}
		getUserFriends();
	}, [profile, render, userFriends])

	const renderFriends: () => void = () => {
    setRender(!render);
  }

  	const seeFriendProfile: (friend: UserDto) => void = (friend) => {
    g_viewed_users_history.push(profile);
		if (friend === null) return ;
			changeProfile(friend);
    	if (ownAccount === true)
			changeAccountOwner(false);
  }

	const _removeFriend: (id: number) => void = async (id) => {
		removeFriend(profile.id, id);
		removeFriend(id, profile.id);
		renderFriends();
	}

	const changeFriendsPage: () => void = () => {
		if (searchF)
			setSearchF(false);
		else
			setSearchF(true);
	}

  	return (
		<div className='extension-ctn'>
			<h2 className='profile-title'>Friends</h2>
				{searchF && <FindFriends profile={profile} userFriends={userFriends} renderFriends={renderFriends} changeFriendsPage={changeFriendsPage}/>}
				{!searchF &&
				<Stack spacing={2}>
					<Button variant='contained' onClick={()=> changeFriendsPage()}>
					Find Friends
					</Button>
					<Card sx={{minWidth: 300}} >
						<List sx={{ width: '100%', maxWidth: 360, overflow: 'auto', maxHeight: 500 }}>
							{userFriends.length ? userFriends.map((item, key)=> 
							<ListItem key={key}>
								<ListItemAvatar>
								<Avatar src={item.avatar} onClick={()=> {seeFriendProfile(item); setExt(false)}}/>
								</ListItemAvatar>
								<ListItemText primary={item.login} secondary={item.status} onClick={()=> {seeFriendProfile(item); setExt(false)}}/>
								<Button variant='outlined' onClick={(e)=> _removeFriend(item.id)}>Remove</Button>
							</ListItem>
							) : <p>No friends</p>}
						</List>
					</Card>
				</Stack>}
		</div>
	);
}

const MatchHistory: React.FC<mhProps> = ({ user }) => {
	// eslint-disable-next-line
	const [profile, setProfile] = useState<UserDto>(user);
	const [userMatchHistory, setUserMatchHistory] = useState<CompleteMatchHistoryDto[]>([]);

	const createCompleteMatchHistory: (match: MatchHistoryDto) => Promise<CompleteMatchHistoryDto | null> = async (match) => {
		const opponent = await getUser(match.opponentId);
		if (opponent === null) return null;
		return {
			id: match.id,
			user: match.user,
			userScore: match.userScore,
			opponent: opponent,
			opponentScore: match.opponentScore
		};
	}

	useEffect(() => {
		const getUserMatchHistory: () => void = async () => {
			let matchHistory: MatchHistoryDto[]  = await getMatchHistoryOfUser(profile.login);
			let matchHistory1: (CompleteMatchHistoryDto | null)[] = await Promise.all(matchHistory.map(async (item) => { return await createCompleteMatchHistory(item); }));
			// @ts-ignore
			let matchHistory2: CompleteMatchHistoryDto[] = matchHistory1.filter((match) => match !== null);
			setUserMatchHistory(matchHistory2);
		}
		getUserMatchHistory();
	}, [profile])

	return (
		<div className='extension-ctn'>
			<h2 className='profile-title'>Match History</h2>
				<List>
					{userMatchHistory.length ? userMatchHistory.map((elem, key)=>
					<ListItem key={key} disablePadding>
						<ListItemText primary={`${elem.user.login} VS ${elem.opponent.login} | ${elem.userScore} : ${elem.opponentScore}`}/>
					</ListItem>)
					:
					<ListItem disablePadding>
						<ListItemText primary="No matches"/>
					</ListItem>
					}
					<ListItem disablePadding>
					</ListItem>
				</List>
		</div>
	);
}

const Profile: React.FC<profileProps> = ({ user, changeUser, back, myAccount, logout }) => {
	const [profile, setProfile] = useState<UserDto>(user);
	const [ownAccount, setOwnAccount] = useState<boolean>(myAccount);
	const [render, setRender] = useState<boolean>(true);
	const [settings, setSettings] = useState<boolean>(false);
	const [showMH, setShowMH] = useState<boolean>(false);
	const [friends, setFriends] = useState<boolean>(false);
	const [searchF, setSearchF] = useState<boolean>(false);

	useEffect(() => {
		const getLatestProfile: () => void = async () => {
			const latestProfile = await getUser(profile.id);
			if (latestProfile === null || _.isEqual(latestProfile, profile)) return ;
			changeProfile(latestProfile);
		}
		getLatestProfile();
	// eslint-disable-next-line
}, [render])

	const changeAccountOwner: (newValue: boolean) => void = (newValue) => {
    setOwnAccount(newValue);
		setSettings(false);
  }

	const changeProfile: (newProfile: UserDto) => void = (newProfile) => {
    setProfile(newProfile);
  }

	const renderPage: () => void = () => {
    setRender(!render);
  }

	const changeExtension: (ext: string) => void = (ext) => {
		if (ext === "settings")
		{
			setShowMH(false);
			setFriends(false);
			setSettings(!settings);
		}
		else if (ext === "matchs")
		{
			setSettings(false);
			setFriends(false);
			setShowMH(!showMH);
		}
		else
		{
			setSearchF(false);
			setSettings(false);
			setShowMH(false);
			setFriends(!friends);
		}
	}
	
	return (
		<div className='full-profile-main-ctn'>
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
			<div className='profile-main-ctn'>
				<div className='profile-ctn'>
					{!ownAccount && <Button onClick={() => {changeProfile(user); setOwnAccount(true); setShowMH(false)}} >Close</Button>}
					<h2 className='profile-title'>Profile</h2>
					<Stack spacing={2}>
							<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
								<Avatar sx={{ width: 100, height: 100}} src={profile.avatar} />
							</Box>
							<Card>
								<CardContent>
									<Typography variant="h5" component="div">
										{profile.name}
									</Typography>
									<Typography variant="h5" component="div" color="text.secondary">
										{profile.login}
									</Typography>
								</CardContent>
							</Card>
							<Card sx={{ minWidth: 350 }}>
								<CardContent>
        							<Typography variant="h5" component="div">
										Status
									</Typography>
									<Typography sx={{ fontSize: 14 }} color={profile.status === "Offline" && !ownAccount ? {color: "red"} : {color: "green"}} gutterBottom>
										{ownAccount ? "Online" : profile.status }
									</Typography>
									<Typography variant="h5" component="div">
										Ratio
									</Typography>
									<Typography sx={{ fontSize: 14 }} color="text.secondary">
										{(`${profile.numberOfWin} / ${profile.numberOfLoss}`) ? (`${profile.numberOfWin} / ${profile.numberOfLoss}`) : 0}
									</Typography>
									<Typography variant="h5" component="div">
										Wins
									</Typography>
									<Typography sx={{ fontSize: 14 }} color="text.secondary">
										{profile.numberOfWin}
									</Typography>
									<Typography variant="h5" component="div">
										Losses
									</Typography>
									<Typography sx={{ fontSize: 14 }} color="text.secondary">
										{profile.numberOfLoss}
									</Typography>
								</CardContent>
							</Card>
					</Stack>
					<br/>
					<ButtonGroup variant="contained" aria-label="outlined button group">
						{ownAccount && <Button onClick={() => changeExtension("settings")}>Settings</Button>}
						{ownAccount && <Button onClick={() => changeExtension("friends")}>Friends</Button>}
						<Button onClick={() => changeExtension("matchs")}>Match History</Button>
					</ButtonGroup>
				</div>
				{settings && <Settings user={user} changeUser={changeUser} renderPage={renderPage}/>}
				{showMH && <MatchHistory user={profile}/>}
				{friends && !searchF && <Friends profile={profile} changeProfile={changeProfile} ownAccount={ownAccount} changeAccountOwner={changeAccountOwner} setExt={setFriends}/>}
			</div>
		</div>
	);
}

export default Profile;