import { AppBar, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { GameDto } from "../../api/games/dto/game.dto";
import { getAllGames, removeGame } from "../../api/games/games.api";
import { UserDto } from "../../api/user/dto/user.dto";
import { getUser, updateUser } from "../../api/user/user.api";
import ChatsView from "../chat/chatsView";
import Profile from "../profile/profile";
import Play from "../play/Play";
import MenuIcon from '@mui/icons-material/Menu';
import './home.css'

const HomeDisplay: React.FC<{user: UserDto, changeMenuPage: (newMenuPage: string) => void, logout: () => void}> = ({user, changeMenuPage, logout}) => {

	return (
		<div className='full-menu-main-ctn'>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static" color="secondary">
					<Toolbar>
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						ft_transcendence
					</Typography>
					<Button variant="contained" color="primary" onClick={() => logout()}>Logout</Button>
					</Toolbar>
				</AppBar>
			</Box>
			<div className='start-main-ctn'>
				<div className='home-ctn'>
					<h2 className='start-title'>Menu</h2>
					<br/>
					<Stack spacing={2}>
						<Button className='game-button-text' variant="contained" onClick={() => changeMenuPage("play")}>PONG</Button>
						<Button className='game-button-text' variant="contained" onClick={() => changeMenuPage("chat")}>MESSAGE</Button>
						<Button className='game-button-text' variant="contained" onClick={() => changeMenuPage("profile")}>PROFILE</Button>
					</Stack>
				</div>
			</div>
		</div>
	);
}

const Home: React.FC<{user: UserDto, changeUser: (newUser: UserDto | null) => void}> = ({ user, changeUser }) => {
	const [menuPage, setMenuPage] = useState<string>("home");
	const [game, setGame] = useState<GameDto | null>(null);
	const [state, setState] = useState<boolean>(true);

	useEffect(() => {
			const removeActiveGame: () => void = async () => {
				//Remove all games associated with the user that have not been finished yet
				let myGame = await findMyGame();
				if (myGame !== null)
                removeGame(myGame.id);
		}
		if (user.status === "Offline")
            removeActiveGame(); //Before user will be set as Online, so only called once at connection
	//eslint-disable-next-line
	}, []);

	useEffect(() => {
		const keepOnline: () => void = async () => {
			const unixTimeStamp = Math.round(new Date().getTime() / 1000).toString();
			updateUser(user.id, {latestTimeOnline: unixTimeStamp});
		}
 		const interval = setInterval(keepOnline, 1500);
		return () => clearInterval(interval);
	//eslint-disable-next-line
	}, []);

	const findMyGame: () => Promise<GameDto | null> = async () => {
		const games = await getAllGames();
		let myGame = games.find((findGame: GameDto) =>
					(findGame.user1.id === user.id || (findGame.user2 !== null && findGame.user2.id === user.id)));
		if (myGame === undefined) return null;
		return myGame;
	}

	//Change user status, check if game exists with user in it, if it does and is the only user he is searching the game else he is in a game...
	useEffect(()=>{
        const findGameAndSetStatus: () => Promise<void> = async () => {
			let latestUser = await getUser(user.id);
			if (latestUser === null) return ;
			let myGame = await findMyGame();
			if (myGame === null) {
					if (latestUser.status !== "Online") updateUser(user.id, {status: "Online"})
			} else if (myGame.user2 === null) {
				if (latestUser.status !== "Searching a game") updateUser(user.id, {status: "Searching a game"});
			} else {
				if (latestUser.status !== "In a game") updateUser(user.id, {status: "In a game"});
				if (latestUser.status === "Online") changeGame(myGame); //If someone accepts game demand from chat launch it...
			}
        }
        const interval = setInterval(findGameAndSetStatus, 2000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    const changeGame: (newGame: GameDto | null) => void = (newGame) => {
        setGame(newGame);
    }

	const changeMenuPage: (newMenuPage: string) => void = (newMenuPage) => {
		setMenuPage(newMenuPage);
	}

	const back: () => void = () => {
		changeMenuPage("home");
	}

	const logout: () => void = async () => {
		let profile = user;
		if (profile.status === "Online") 
			updateUser(profile.id, {status: "Offline"});
		changeUser(null);
	}

	const buttonEvent = async (e: any) => {
		e.preventDefault();
		setState(false);
		if (e.state === "home" || e.state === "profile" || e.state === "chat" || e.state === "play")
			changeMenuPage(e.state);
		else
			logout();
	}
	
	useEffect(() => {
		if (state === true)
			window.history.pushState(menuPage, "");
		setState(true);
		window.addEventListener('popstate', buttonEvent);
		return () => {
			window.removeEventListener('popstate', buttonEvent);
		};
		// eslint-disable-next-line
	}, [menuPage]);

	if (menuPage === "home") {
	    return <HomeDisplay user={user} changeMenuPage={changeMenuPage} logout={logout}/>;
	} else if (menuPage === "play" || game !== null) {
		return <Play user={user} changeUser={changeUser} changeMenuPage={changeMenuPage} game={game} changeGame={changeGame} logout={logout}/>;
	} else if (menuPage === "chat") {
		return <ChatsView user={user} changeUser={changeUser} changeMenuPage={changeMenuPage} changeGame={changeGame} back={back} logout={logout}/>;
	} else if (menuPage === "profile") {
		return <Profile user={user} changeUser={changeUser} back={back} myAccount={true} logout={logout}/>;
	} else {
		return <h1>Home Error</h1>;
	}
}

export default Home;