import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserDto } from "../../api/user/dto/user.dto";
import { Button, Divider, Stack, TextField } from "@mui/material";
import { addUser, createNewUser, getUserByLogin, getUserByName, userPasswordVerification, verify2FA } from "../../api/user/user.api";
import { OAuth42_access_token, OAuth42_user } from "../../OAuth42/login";
import './authentication.css';
import Home from "../home/home";
import { Input } from '@mui/material';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

interface logFormProps {
	changePage: (newPage: string) => void
	changeUser: (newUser: UserDto | null) => void
	signup: boolean
	alreadyConnected: boolean
	changeAlreadyConnected: (newValue: boolean) => void
	changeTwoFA: any
}

const LogForm: React.FC<logFormProps> = ({ changePage, changeUser, signup, alreadyConnected, changeAlreadyConnected, changeTwoFA }) => {
	let [accountAlreadyInUse, setAccountAlreadyInUse] = useState<boolean>(false);
	let [nonExistingAccount, setNonExistingAccount] = useState<boolean>(false);
	let [wrongPassword, setWrongPassword] = useState<boolean>(false);
	let [name, setName] = useState<string>('');
	let [login, setLogin] = useState<string>('');
	let [avatar, setAvatar] = useState<string>('');
	let [password, setPassword] = useState<string>('');

	const onSubmitLogin: () => void = async () => {
		if (password === "" || name === "") return ;
		await new Promise(r => setTimeout(r, 1000));
		let userInDatabase = await getUserByName(name);
		if (userInDatabase === null) {
			setNonExistingAccount(true);
			setWrongPassword(false);
			setName('');
			setLogin('');
			setAvatar('');
			setPassword('');
		} else {
			setNonExistingAccount(false);
			if (!(await userPasswordVerification(userInDatabase.id, password))) {
				setPassword('');
				setWrongPassword(true);
				return ;
			}
			setWrongPassword(false);
			if (userInDatabase.status === "Online") {
				changeAlreadyConnected(true);
				return ;
			}
			changeTwoFA(userInDatabase.has2FA);
			changeUser(userInDatabase)
		}
	}

	const onSubmitSignup: () => void = async () => {
		if (password === "" || name === "" || login === "") return ;
		let userInDatabaseByName = await getUserByName(name);
		let userInDatabaseByLogin = await getUserByLogin(login);
		if (userInDatabaseByName === null && userInDatabaseByLogin === null) {
			await addUser(createNewUser(name, login, avatar, password));
			let userInDatabase = await getUserByName(name);
			setAccountAlreadyInUse(false);
			changeTwoFA(userInDatabase!.has2FA);
			changeUser(userInDatabase);
		} else {
			setAccountAlreadyInUse(true);
			setName('');
			setLogin('');
			setAvatar('');
			setPassword('');
		}
	}

	const changeAvatar: (event: any) => void = async (event) => {
		if (!event.target.files) return ;
		let reader = new FileReader();
	 	reader.onload = async (e) => {
			if (e === null || e!.target!.result === null) return ;
			setAvatar(e!.target!.result as string);
	 	};
	 	reader.readAsDataURL(event.target.files[0]);
 }
	// return (<div>
	// 					<button className='game-button-text' onClick={()=>{changePage("start")}}>Back</button>
	// 					{!signup ? <h1>Log in</h1> : <h1>Sign up</h1>}
	// 					<label>Name:</label><br/>
	// 					<input className='game-button-text' type="text" value={name} maxLength={40} onChange={(e)=>setName(e.target.value)} required/>
	// 					{signup && <br/>}
	// 					{signup && <br/>}
	// 					{signup && <label>Login:</label>}
	// 					{signup && <br/>}
	// 					{signup && <input className='game-button-text' type="text" value={login} maxLength={20} onChange={(e)=>setLogin(e.target.value)} required/>}
	// 					<br/><br/>
	// 					<label>Password:</label>
	// 					<br/>
	// 					<input className='game-button-text' type="password" value={password} maxLength={20} onChange={(e)=>setPassword(e.target.value)} required/>
	// 					{signup && <br/>}
	// 					{signup && <br/>}
	// 					{signup && <><label className='game-button-text'>Download Avatar Image
	// 											<input type="file" accept="image/*" onChange={(e)=>changeAvatar(e)}/>
	// 										</label><br/></>}
	// 					<br/><br/>
	// 					{accountAlreadyInUse && <p>This account already exists</p>}
	// 					{nonExistingAccount && <p>This account does not exist</p>}
	// 					{alreadyConnected && <p>User is already connected</p>}
	// 					{wrongPassword && <p>Wrong Password</p>}
	// 					<button className='game-button-text' type="submit" onClick={()=> signup ? onSubmitSignup() : onSubmitLogin()}>Submit</button>
	// 			</div>);

	return (
		<div className='start-main-ctn' style={{backgroundImage:"url('./img/main-bg.jpg')"}}>
			<div className='start-ctn'>
				{!signup ? <h2>Log in</h2> : <h2>Sign up</h2>}
				<Stack spacing={2}>
					<TextField required id="outlined-required" label="Required" placeholder="Name" onChange={(e)=>setName(e.target.value)}/>
					{signup && <TextField required id="outlined-required" label="Required" placeholder="Login" onChange={(e)=>setLogin(e.target.value)}/>}
					<TextField required id="outlined-required" label="Required" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
					{signup && <Button className='game-button-text' variant="outlined"> 
						Upload Avatar <input type="file" accept="image/*" onChange={(e)=>changeAvatar(e)}/>    {/*style={{ display: 'none' }}*/}
					</Button>}
					{accountAlreadyInUse && <p>This account already exists</p>}
					{nonExistingAccount && <p>This account does not exist</p>}
					{alreadyConnected && <p>User is already connected</p>}
					{wrongPassword && <p>Wrong Password</p>}
					<Button className='game-button-text' variant="contained" onClick={()=> signup ? onSubmitSignup() : onSubmitLogin()}> 
						Submit
					</Button>
				</Stack>
			</div>
		</div>);
}

const TwoFactorAuthentication: React.FC<{user: UserDto, changeTwoFA: (newValue: boolean) => void, twoFA: boolean}> = ({user, changeTwoFA, twoFA}) => {
	let [token, setToken] = useState<string>('');
	let [wrongToken, setWrongToken] = useState<boolean>(false);

	const verify2FAuth: () => void = async () => {
		setToken('');
		const correct = await verify2FA(user.secret2FA, token);
		if (correct) {
			setWrongToken(false);
			changeTwoFA(!twoFA)
		} else {
			setWrongToken(true);
		}
	}

	const keyPress: (e: any) => void = (e) => {
		if(e.keyCode == 13){
			verify2FAuth();
		// put the login here
		}
	}

    return (
		<div className='start-main-ctn' style={{backgroundImage:"url('./img/main-bg.jpg')"}}>
			<div className='start-ctn'>
				<h2 className='start-title'>Two Factor Authentication</h2>
				<br/>
				<TextField label="Token" defaultValue={token} onKeyDown={(e)=>keyPress(e)} onChange={(e)=>setToken(e.target.value)}/>
				{wrongToken && <><>&nbsp;&nbsp;</><span>Wrong Token</span></>}
			</div>
		</div>
	)
	// return (
	// 	<div>
	// 					<h1>Two Factor Authentication</h1>
	// 					<label>Token: </label>
	// 					<input type="text" value={token} onChange={(e)=>setToken(e.target.value)}/>
	// 					{/* {token.length === 6 && verify2FAuth()} */}
	// 					{wrongToken && <><>&nbsp;&nbsp;</><span>Wrong Token</span></>}
	// 	</div>
	// )
}

const loginWithApi = async () => {
	window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`
}

const Start: React.FC<{changePage: (newPage: string) => void, alreadyConnected: boolean}> = ({ changePage, alreadyConnected }) => {
	return (
	<div className='start-main-ctn' style={{backgroundImage:"url('./img/main-bg.jpg')"}}>
		<div className='start-ctn'>
			<h2 className='start-title'>Welcome to my transcendence</h2>
			<p>I am the best pong player</p>
			<Stack spacing={2}>
				<Button className='game-button-text' variant="contained" onClick={()=>{changePage('login')}}>
					Log in
				</Button>
				<Button className='game-button-text' variant="contained" onClick={()=>{changePage('signup')}}>
					Sign up
				</Button>
				<Button className='game-button-text' variant="contained" onClick={() => loginWithApi()}> 
					Log with 42
				</Button>
				{alreadyConnected && <p>User is already connected</p>}
			</Stack>
		</div>
	</div>
	);
	// return (<div>
	// 					<h1>Pong Game</h1>
	// 					<button className={styles.loginButton} onClick={()=>{changePage('login')}}>Log in</button><>&nbsp;&nbsp;</>
	// 					<button className={styles.signupButton} onClick={()=>{changePage('signup')}}>Sign up</button><>&nbsp;&nbsp;</>
	// 					<button className={styles.intraLoginButton} onClick={()=>{window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;}}>Intra 42</button>
	// 					{alreadyConnected && <p>User is already connected</p>}
	// 				</div>);
}

const Authentication: React.FC = () => {
	const [searchParams] = useSearchParams(); //Will enable the extraction of queryparams
	const AUTH_CODE = searchParams.get('code'); //code queryparam extraction gives us an authorization code necessary for OAuth access token generation
	const [user, setUser] = useState<UserDto | null>(null);
	const [page, setPage] = useState<string>('start');
	const [twoFA, setTwoFA] = useState<boolean>(false);
	const [alreadyConnected, setAlreadyConnected] = useState<boolean>(false);

	useEffect(() => {
		const user42 = async () => {
			if (AUTH_CODE !== null) {
				const ACCESS_TOKEN = await OAuth42_access_token(AUTH_CODE);
				if (ACCESS_TOKEN !== null) {
					const user = await OAuth42_user(ACCESS_TOKEN);
					await new Promise(r => setTimeout(r, 2000));
					let userInDatabase = await getUserByName(user.name);
					if (userInDatabase === null) {
						userInDatabase = await addUser(createNewUser(user.name, user.login, user.avatar));
						userInDatabase.status = "Offline";
					}
					if (userInDatabase.status === "Online") {
						changeAlreadyConnected(true);
						return ;
					}
					changeTwoFA(userInDatabase.has2FA);
					setUser(userInDatabase);
				}
			}
		}
		user42();
	}, [AUTH_CODE]);

	const changeUser: (newUser: UserDto | null) => void = (newUser) => {
		setUser(newUser);
	}

	const changePage: (newPage: string) => void = (newPage) => {
		changeAlreadyConnected(false);
		setPage(newPage);
	}

	const changeTwoFA: (newValue: boolean) => void = (newValue) => {
		setTwoFA(newValue);
	}

	const changeAlreadyConnected: (newValue: boolean) => void = (newValue) => {
		setAlreadyConnected(newValue);
	}

	if (user !== null) {
		if (twoFA)
			return (<TwoFactorAuthentication user={user} changeTwoFA={changeTwoFA} twoFA={twoFA}/>)
		if (page !== "start")
            changePage("start");
		return (<Home user={user} changeUser={changeUser}/>);
	}
    else if (page === "start") {
		return (<Start changePage={changePage} alreadyConnected={alreadyConnected}/>);
	}
    else if (page === "signup" || page === "login") {
		return (<LogForm changePage={changePage} changeUser={changeUser}
			signup={page === "signup" ? true : false} alreadyConnected={alreadyConnected}
			changeAlreadyConnected={changeAlreadyConnected} changeTwoFA={changeTwoFA}/>);
	}
    else {
		return <h1>Authentification Error</h1>;
	}
}

export default Authentication;