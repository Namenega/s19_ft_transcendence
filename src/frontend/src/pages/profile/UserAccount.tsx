import { useEffect, useState } from "react";
import { GameDto } from "../../api/games/dto/game.dto";
import { getAllGames } from "../../api/games/games.api";
import { CompleteMatchHistoryDto, MatchHistoryDto } from "../../api/match-history/dto/match-history.dto";
import { getMatchHistoryOfUser } from "../../api/match-history/match-history.api";
import { UserDto } from "../../api/user/dto/user.dto";
import { get2FASecret, getAllUsers, getUser, getUserByLogin, updateUser, verify2FA } from "../../api/user/user.api";
import _ from 'underscore';
import { FriendsDto } from "../../api/friends/dto/friends.dto";
import { addFriend, createNewFriend, getFriendsOfUser, removeFriend } from "../../api/friends/friends.api";
import './UserAccount.css';
import QRCode from 'qrcode';
import { AppBar, Avatar, Button, IconButton, Stack, Toolbar, Typography, Badge, Card, Container, ButtonGroup, TextField, FormControlLabel, Checkbox, CardContent, Divider, ListItem, Paper, InputBase } from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from '@mui/icons-material/Menu';

let g_viewed_users_history: UserDto[] = [];

interface profileProps {
	user: UserDto,
	changeUser: (newUser: UserDto | null) => void,
	back: () => void,
	myAccount: boolean,
	changeGame: (newgame: GameDto | null) => void
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
	changeFriendsPage: () => void
}

interface mhProps {
	user: UserDto,
}

const Settings: React.FC<settingsProps> = ({ user, changeUser, renderPage }) => {
	let [login, setLogin] = useState<string>('');
	let [loginAlreadyInUse, setLoginAlreadyInUse] = useState<boolean>(false);
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
			await updateUser(user.id, {has2FA: true});
			user.has2FA = true;
			changeUser(user);
			renderPage();

		} else {
			setWrongToken(true);
		}
	}

	const changeAvatar: (event: any) => void = async (event) => {
		if (!event.target.files) return ;
		let reader = new FileReader();
	 	reader.onload = async (e) => {
			if (e === null || e!.target!.result === null) return ;
			let error = await updateUser(user.id, {avatar: e!.target!.result as string});
			user.avatar = e!.target!.result as string;
			changeUser(user);
			renderPage();
	 	};
	 	reader.readAsDataURL(event.target.files[0]);
 }

		const keyPress: (e: any) => void = (e) => {
			if(e.keyCode == 13){
				verify2FAuth();
			// put the login here
			}
		}

 	return (
        <div className='extension-ctn'>
			<h2 className='profile-title'>Settings</h2>
			<Stack spacing={2}>
				<TextField id="outlined-basic" label="New login" variant="outlined" onChange={(e)=>setLogin(e.target.value)}/>
				<Button variant="contained" type="submit" onClick={()=>newLogin(login)}>Submit</Button>
				{loginAlreadyInUse && <span>This login is already in use</span>}
				<Divider variant="middle" />
				<FormControlLabel control={<Checkbox checked={activate2FA} onChange={()=>changeTwoFactorAuthentication()}/>} label="Two Factor Authentication" />
				{qrcode !== '' && <img src={qrcode} alt={"QR code"}/>}
				{qrcode !== '' && <TextField label="Token" defaultValue={token} onKeyDown={(e)=>keyPress(e)} onChange={(e)=>setToken(e.target.value)}/>}
				{wrongToken && <span>Wrong Token</span>}
				<Divider variant="middle" />
				<Button className='game-button-text' variant="outlined"> 
					Change Avatar <input style={{ display: 'none' }} type="file" accept="image/*" onChange={(e)=>changeAvatar(e)}/>
				</Button>
			</Stack>
        </div>
	);
	
	// return (
	// 	<div className="profile-settings-ctn"> 
	// 		<h1>SETTINGS</h1>
	// 		<p>
	// 			<br/><label>New Login: </label>
	// 			<input type="text" value={login} onChange={(e)=>setLogin(e.target.value)}/><>&nbsp;&nbsp;</>
	// 			<Button variant="contained" type="submit" onClick={()=>newLogin(login)}>Submit</Button>
	// 			{loginAlreadyInUse && <><>&nbsp;&nbsp;</><span>This login is already in use</span></>}
	// 		</p>
	// 	</div>
	// );

	// return (<div>
	// 					<br/><label>New Login: </label>
	// 					<input className={cs.textInput} type="text" value={login} onChange={(e)=>setLogin(e.target.value)}/><>&nbsp;&nbsp;</>
	// 					<button className={cs.submitButton} type="submit" onClick={()=>newLogin(login)}>Submit</button>
	// 					{loginAlreadyInUse && <><>&nbsp;&nbsp;</><span>This login is already in use</span></>}
	// 					<br/><br/><label>Two-factor-authentication: </label>
	// 					{user.hasTwoFactorAuthentication && <input type="checkbox" onClick={()=>changeTwoFactorAuthentication()} checked/>}
	// 					{!user.hasTwoFactorAuthentication && <input type="checkbox" onClick={()=>changeTwoFactorAuthentication()}/>}
	// 					{qrcode !== '' && <><br/><img src={qrcode} alt={"QR code"}/><br/></>}
	// 					{qrcode !== '' && <label>Token: </label>}
	// 					{qrcode !== '' && <input className={cs.textInput} type="text" value={token} onChange={(e)=>setToken(e.target.value)}/>}
	// 					{token.length === 6 && verify2FAuth()}
	// 					{wrongToken && <><>&nbsp;&nbsp;</><span>Wrong Token</span></>}
	// 					<br/><br/>
	// 					<label className={cs.chooseFileButton}>Download Avatar Image
	// 					<input type="file" accept="image/*" onChange={(e)=>changeAvatar(e)}/>
	// 					</label>
	// 			  </div>)
}

const FindFriends: React.FC<FindFriendsProps> = ({ profile, userFriends, renderFriends, changeFriendsPage }) => {
	const [searchResults, setSearchResults] = useState<UserDto[]>([]);
  	const [searchText, setSearchText] = useState<string>('');
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
    setSearchText(searchValue);
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

	// return (<div> FIND FRIENDS </div> );
  	return (
  		<div>
			<Stack spacing={1}>
				<Button variant='contained' onClick={()=> changeFriendsPage()}>
					Friends list
				</Button>
				<TextField id="outlined-basic" label="Find Friends" variant="standard" onChange={(e) => handleSearch(e.target.value)}>
					{/* <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Find friends" onChange={(e) => handleSearch(e.target.value)}/> */}
				</TextField>
			</Stack>
            {/* <input placeholder={"New friends..."} type="text" value={searchText} onChange={(e) => handleSearch(e.target.value)}/><br/> */}
            {showResult && searchResults.map((item) => <div>
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

const Friends: React.FC<FriendsProps> = ({ profile, changeProfile, ownAccount, changeAccountOwner }) => {
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
		// getUserFriends();
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
		await removeFriend(profile.id, id);
		await removeFriend(id, profile.id);
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
				<Button variant='contained' onClick={()=> changeFriendsPage()}>
					Find Friends
				</Button>}
				{!searchF && userFriends.length ? userFriends.map((elem) => <div>
 				<span onClick={()=> seeFriendProfile(elem)}>{`${elem.login}`}</span><>&nbsp;&nbsp;</>
 				{!searchF && <><button onClick={(e)=> _removeFriend(elem.id)}>Remove</button><br/><br/></>}</div>)
				: <p>No friends</p>}
				<br/>
		</div>
	);

//   return (
//   <div>
//      <h3>Friends</h3>
//      {userFriends.length ? userFriends.map((elem) => <div>
// 		<span className={cs.clickable} onClick={()=> seeFriendProfile(elem)}>{`${elem.login}`}</span><>&nbsp;&nbsp;</>
// 		{ownAccount && <><button className={styles.removeFriendButton}
// 		onClick={(e)=> _removeFriend(elem.id)}>
// 		Remove</button><br/><br/></>}
//		</div>)
// 		: <p>No friends</p>}
// 		<br/>
//      {ownAccount && <FindFriends profile={profile} userFriends={userFriends} renderFriends={renderFriends}/>}
//   </div>);
}

const MatchHistory: React.FC<mhProps> = ({ user }) => {
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
				<table style={{"margin": "auto"}}>
				{userMatchHistory.length ? userMatchHistory.map((elem)=><tr>
				<td>{`${elem.user.login} VS ${elem.opponent.login}`}</td>
				<td>|</td>
				<td>{`${elem.userScore} : ${elem.opponentScore}`}</td>
				</tr>) : <p>No matches</p>}
				</table>
		</div>
	);
}

const Profile: React.FC<profileProps> = ({ user, changeUser, back, myAccount, changeGame }) => {
	const [profile, setProfile] = useState<UserDto>(user);
	const [ownAccount, setOwnAccount] = useState<boolean>(myAccount);
	// const [userMatchHistory, setUserMatchHistory] = useState<CompleteMatchHistoryDto[]>([]);
	const [render, setRender] = useState<boolean>(true);
	const [settings, setSettings] = useState<boolean>(false);
	const [showMH, setShowMH] = useState<boolean>(false);
	const [friends, setFriends] = useState<boolean>(false);
	const [searchF, setSearchF] = useState<boolean>(false);

	// const createCompleteMatchHistory: (match: MatchHistoryDto) => Promise<CompleteMatchHistoryDto | null> = async (match) => {
	// 	const opponent = await getUser(match.opponent_id);
	// 	if (opponent === null) return null;
	// 	return {
	// 		id: match.id,
	// 		me: match.me,
	// 		my_score: match.my_score,
	// 		opponent: opponent,
	// 		opponent_score: match.opponent_score
	// 	};
	// }

	useEffect(() => {
		const getLatestProfile: () => void = async () => {
			const latestProfile = await getUser(profile.id);
			if (latestProfile === null || _.isEqual(latestProfile, profile)) return ;
			changeProfile(latestProfile);
		}
		getLatestProfile();
	// eslint-disable-next-line
}, [render])

	// useEffect(() => {
	// 	const getUserMatchHistory: () => void = async () => {
	// 		let matchHistory: MatchHistoryDto[]  = await getMatchHistoryOfUser(profile.login);
	// 		let matchHistory1: (CompleteMatchHistoryDto | null)[] = await Promise.all(matchHistory.map(async (item) => { return await createCompleteMatchHistory(item); }));
	// 		// @ts-ignore
	// 		let matchHistory2: CompleteMatchHistoryDto[] = matchHistory1.filter((match) => match !== null);
	// 		setUserMatchHistory(matchHistory2);
	// 	}
	// 	getUserMatchHistory();
	// }, [profile])

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

	const logout: () => void = async () => {
		if (profile.status === "Online") await updateUser(profile.id, {status: "Offline"});
		changeUser(null);
	}

	const backFromViewedProfile: () => void = async () => {
		let latestProfile = await getUser(g_viewed_users_history[g_viewed_users_history.length - 1].id);
		if (latestProfile === null) return ;
		changeProfile(latestProfile);
		g_viewed_users_history.pop();
		if (g_viewed_users_history.length === 0 && myAccount === true) changeAccountOwner(true);
	}

	const watchGame: () => void = async () => {
		let latestUser = await getUser(profile.id);
		if (latestUser === null || latestUser.status !== "In a game") {
			if (latestUser === null) return ;
			changeProfile(latestUser);
			return ;
		}
		const games = await getAllGames();
		let Game = games.find((findGame: GameDto) =>
					(findGame.user1.id === profile.id || (findGame.user2 !== null && findGame.user2.id === profile.id)));
		if (Game === undefined) return ;
		g_viewed_users_history = [];
		changeGame(Game);
	}

	const showSettings: () => void = () => {
		if (settings)
			setSettings(false);
		else
			setSettings(true);
	}

	const showMatchH: () => void = () => {
		if (showMH)
			setShowMH(false);
		else
			setShowMH(true);
	}

	const showFriends: () => void = () => {
		setSearchF(false);
		if (friends)
			setFriends(false);
		else
			setFriends(true);
	}

	const changeExtension: (ext: string) => void = (ext) => {
		if (ext === "settings")
		{
			setShowMH(false);
			setFriends(false);
			showSettings();
		}
		else if (ext === "matchs")
		{
			setSettings(false);
			setFriends(false);
			showMatchH();
		}
		else
		{
			setSettings(false);
			setShowMH(false);
			showFriends();
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
							<Card>
								<CardContent>
        							<Typography variant="h5" component="div">
										Status
									</Typography>
									<Typography sx={{ fontSize: 14 }} color={profile.status === "Offline" ? {color: "red"} : {color: "green"}} gutterBottom>
										{profile.status}
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
							<ButtonGroup variant="contained" aria-label="outlined button group">
								{ownAccount && <Button onClick={() => changeExtension("settings")}>Settings</Button>}
								{ownAccount && <Button onClick={() => changeExtension("friends")}>Friends</Button>}
								{!ownAccount && <Button>Block</Button>}
								{!ownAccount && <Button>Add</Button>}
								<Button onClick={() => changeExtension("matchs")}>Match History</Button>
							</ButtonGroup>
					</Stack>
				</div>
				{settings && <Settings user={user} changeUser={changeUser} renderPage={renderPage}/>}
				{showMH && <MatchHistory user={user}/>}
				{friends && !searchF && <Friends profile={profile} changeProfile={changeProfile} ownAccount={ownAccount} changeAccountOwner={changeAccountOwner}/>}
			</div>
		</div>
	);
	// return (
	// 	<div className='basic-main-ctn'>
	// 		<Box sx={{ flexGrow: 1 }}>
	// 			<AppBar position="static" color="secondary">
	// 				<Toolbar>
	// 				<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
	// 					<MenuIcon onClick={() => back()}/>
	// 				</IconButton>
	// 				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
	// 					ft_transcendence
	// 				</Typography>
	// 				<Button variant="contained" color="primary" onClick={() => logout()}>Logout</Button>
	// 				</Toolbar>
	// 			</AppBar>
	// 		</Box>
	// 		<div className="profile-main-ctn">
	// 			<div className="profile-banner-ctn">
	// 				<div className='user-name'>
	// 					<div className="profile-banner-avatar-ctn"></div>
	// 					<div>
	// 						<p>{profile.name}</p>
	// 						<p>{profile.login}</p>
	// 					</div>
	// 				</div>
	// 				<div className="profile-banner-statistics-ctn">
	// 					<h1>STATS</h1>
	// 					<p>RATIO: {(`${profile.numberOfWin} / ${profile.numberOfLoss}`) ? (`${profile.numberOfWin} / ${profile.numberOfLoss}`) : 0} ~ {profile.numberOfLoss ? profile.numberOfWin / (profile.numberOfWin + profile.numberOfLoss) * 100 : profile.numberOfWin ? 100 : `N/A`}%</p>
	// 					<p>WINS: {profile.numberOfWin}</p>
	// 					<p>LOSSES: {profile.numberOfLoss}</p>
	// 				</div>
	// 			</div>
	// 			<div className="profile-history-achievements-ctn">
	// 				<div className="profile-history-ctn">Match History</div>
	// 				<div className="profile-achievements-ctn">Achievements</div>
	// 				{settings && <Settings user={user} changeUser={changeUser} renderPage={renderPage}/>} 
	// 			</div>
	// 		</div>
	// 	</div>
	// );

	// return (
	// 	<div className={styles.profileRoot}>
	// 		<div className={styles.profileNavBarSize}>
	// 				{g_viewed_users_history.length === 0 && <><button className={cs.backButton} onClick={()=>{back()}}>Back</button><>&nbsp;&nbsp;</></>}
	// 				{ownAccount && <><button className={!settings ? styles.settingsButton : styles.settingsButtonOn} onClick={()=>{setSettings(!settings); renderPage();}}>Change</button><>&nbsp;&nbsp;</></>}
	// 				{ownAccount && <button className={styles.logoutButton} onClick={()=>{logout()}}>Logout</button>}
	// 				{settings && <Settings user={user} changeUser={changeUser} renderPage={renderPage}/>}
	// 				{g_viewed_users_history.length !== 0 && <button className={cs.backButton} onClick={()=>{backFromViewedProfile()}}>Back</button>}
	// 		</div>
	//--------------------------------------------------------------------------------------------------------------------
	// 	<div className={styles.profileBodySize}>
	// 		<div className={styles.profileHeader}>
	// 			<h1>{profile.login}</h1>
	// 			{profile.avatar ? <img src={profile.avatar} alt={"avatar"} height='100em' width='100em'/> : <MdOutlinePersonOutline size='3em'/>}
	// 		</div>
	// 		<div className={styles.profileBody}>
	// 			<div className={styles.profileUserInfos}>
	// 				<h3>User Info</h3>
	// 				<p><strong>Name</strong><br/>{profile.name}</p>

	// 				<strong>Status</strong><br/>
	// 					{!ownAccount && <span style={profile.status === "Offline" ? {color: "red"} : {color: "green"}}>{profile.status}</span>}
	// 					{!ownAccount && profile.status === "In a game" && <><br/><br/><button className={styles.watchGameButton} onClick={()=>watchGame()}>Watch</button></>}
	// 					{ownAccount && <span style={{color: "green"}}>Online</span>}
	
	// 				<div className={styles.profileFriends}>
	// 					<Friends profile={profile} changeProfile={changeProfile} ownAccount={ownAccount} changeAccountOwner={changeAccountOwner}/>
	// 				</div>
	// 			</div>
	// 			<div className={styles.profileMatchHistory}>
	// 				<h3>Match History</h3>
	// 				<table style={{"margin": "auto"}}>
	// 					{userMatchHistory.length ? userMatchHistory.map((elem)=><tr>
	// 							<td className={styles.profileMatchsDescription}>{`${elem.me.login} VS ${elem.opponent.login}`}</td>
	// 							<td>|</td>
	// 							<td className={styles.profileMatchsDescription}>{`${elem.my_score} : ${elem.opponent_score}`}</td>
	// 						</tr>) : <p>No matches</p>}
	// 				</table>
	//---------------------------------------------------------------------------------------------------------
	// 			</div>
	// 			<div className={styles.profileGameStats}>
	// 				<h3>Stats</h3>
	// 				<p>Ratio: {(profile.nbrVicotry / profile.nbrLoss) ? (profile.nbrVicotry / profile.nbrLoss) : 0}</p>
	// 				<p>Victories: {profile.nbrVicotry}</p>
	// 				<p>Losses: {profile.nbrLoss}</p>
	// 			</div>
	// 		</div>
	// 	</div>
	// </div>
	// );
}

export default Profile;