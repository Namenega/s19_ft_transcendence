import { AppBar, Avatar, Button, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { GameDto } from "../../api/games/dto/game.dto";
import { getAllGames, removeGame } from "../../api/games/games.api";
import { UserDto } from "../../api/user/dto/user.dto";
import { getUser, updateUser } from "../../api/user/user.api";
import ChatsView from "../chat/chatsView";
import Profile from "../profilePage/UserAccount";

// const isLogout = () => {
//     window.location.href = 'http://localhost:3000'
//     setIsLoggedIn(false)
//   }

const HomeDisplay: React.FC<{user: UserDto, changeMenuPage: (newMenuPage: string) => void}> = ({user, changeMenuPage }) => {
	// return (<div>
	// 			{/* <h1>Welcome to the Pong Game</h1> */}
	// 			<button className='game-button-text' onClick={()=>{changeMenuPage('play')}}>Play</button><>&nbsp;&nbsp;&nbsp;</>
	// 			<button className='game-button-text' onClick={()=>{changeMenuPage('chat')}}>Chat</button><>&nbsp;&nbsp;&nbsp;</>
	// 			<button className='game-button-text' onClick={()=>{changeMenuPage('profile')}}>Profile</button><>&nbsp;&nbsp;&nbsp;</>
	// 			<button className='game-button-text' onClick={()=>{changeMenuPage('watch')}}>Watch</button>
	// 		</div>);

	
	return (
		<Box sx={{ flexGrow: 1 }}>
		<AppBar position="static">
		  <Toolbar >
			<Typography variant="h6" component="div">
			  Transcendence
			</Typography>
			<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
			  <Button variant="contained" sx={{marginRight: '10px'}} onClick={() => changeMenuPage("play")}>PLAY</Button>
			  <Button variant="contained" sx={{marginRight: '10px'}} onClick={() => changeMenuPage("chat")}>CHAT</Button>
			  <Button variant="contained" sx={{marginRight: '10px'}} onClick={() => changeMenuPage("profile")}>PROFILE</Button>
			  <Button variant="contained" onClick={() => changeMenuPage("watch")}>WATCH</Button>
			</Box>
			<Avatar alt="Remy Sharp" src="url('')" />
			{/* Avatar 19 a chercher sur l'api */}
		  </Toolbar>
		</AppBar>
	  </Box>
	);
	// <Button color="inherit" onClick={() => isLogout()}>Logout</Button>				// à placer au dessus de <Avatar alt="Remy Sharp" src="url('')" />
}

const Home: React.FC<{user: UserDto, changeUser: (newUser: UserDto | null) => void}> = ({ user, changeUser }) => {
	const [menuPage, setMenuPage] = useState<string>("home");
	const [game, setGame] = useState<GameDto | null>(null);

	/*
	**Goal: Perform actions before user quits unexpectedly (close tabs, refresh, goes to other link...), especially set user status as offline...
	** Method 1:
	** First try to prop the user if he is sure he wants to close the window, this will enable enough time to do the async operations during onbeforeunload event...
	-> Worked on chrome but not on safari... (even when using onunload or onhiddenpage event)
	** Method 2: (cleanest method) -> Method used
	**Onunload method is not very reliable (different browsers can act differently, only functional on single-page-apps, function length can only be short, if server shuts down problem will occur...)
	**usually a setInterval is used to send time while user is online, once he is offline this will stop and by the difference between actual time and last logged time we can know if the user is online or not...
	**When searching only start a game with a player that is online too...
	**If user quits during game... verify if other user is still connected at end of game and if he is not, send his points to the db from the other user or cancel the match and points...
	**If user just connected and has an active game in its name, delete that game...
	** Documentation: https://stackoverflow.com/questions/37900110/how-to-set-offline-a-user-in-the-db-when-it-closes-the-browser
	*/
	useEffect(() => {
			const removeActiveGame: () => void = async () => { //Call in an async function
				//Remove all games associated with the user that have not been finished yet
				let myGame = await findMyGame();
				if (myGame !== null)
                await removeGame(myGame.id);
		}
		if (user.status === "Offline")
            removeActiveGame(); //Before user will be set as Online, so only called once at connection
	//eslint-disable-next-line
	}, []);

	useEffect(() => {
		const keepOnline: () => void = async () => {
			const unixTimeStamp = Math.round(new Date().getTime() / 1000).toString();
			await updateUser(user.id, {latestTimeOnline: unixTimeStamp});
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
					if (latestUser.status !== "Online") await updateUser(user.id, {status: "Online"})
			} else if (myGame.user2 === null) {
				if (latestUser.status !== "Searching a game") await updateUser(user.id, {status: "Searching a game"});
			} else {
				if (latestUser.status !== "In a game") await updateUser(user.id, {status: "In a game"});
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

	if (menuPage === "home") {
	    return (<HomeDisplay user={user} changeMenuPage={changeMenuPage}/>);
	// } else if (menuPage === "play" || game !== null) {
	// 	return <Play user={user} changeUser={changeUser} changeMenuPage={changeMenuPage} game={game} changeGame={changeGame}/>;
	} else if (menuPage === "chat") {
		return <ChatsView user={user} changeUser={changeUser} changeMenuPage={changeMenuPage} changeGame={changeGame}/>;
	} else if (menuPage === "profile") {
		return <Profile user={user} changeUser={changeUser} back={back} myAccount={true} changeGame={changeGame}/>;
	// } else if (menuPage === "watch") {
	// 	return <Watch back={back} changeGame={changeGame}/>;
	} else {
		return <h1>Home Error</h1>;
	}
}

export default Home;