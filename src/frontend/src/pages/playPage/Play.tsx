import React, { useState, useEffect } from 'react';
import { GameDto } from "../../api/games/dto/game.dto";
import { addGame, getAllGames, getGame as GetGame, removeGame, updateGame } from "../../api/games/games.api";
import { UserDto } from "../../api/user/dto/user.dto";
import PongGame from "./gameFunc/PongGame";
// import styles from "../../css/play.module.css";
// import cs from "../../css/convention.module.css";
import { AppBar, Box, Button, Toolbar, Typography, IconButton } from "@mui/material";
import { updateUser } from "../../api/user/user.api";
import MenuIcon from '@mui/icons-material/Menu';
import "./Play.css";
import { margin } from '@mui/system';

const Maps = ['black', 'white', 'winter', 'summer', 'night'];

interface preGamePageProps {
  getGame: "create" | "join" | null
  user: UserDto
  changeUser: (newUser: UserDto | null) => void
  changeGetGame: (page: "create" | "join" | null) => void
  changeMenuPage: (newMenuPage: string) => void
  game: GameDto
  changeGame: (newGame: GameDto | null) => void
}

interface joinGameProps {
  user: UserDto
  changeUser: (newUser: UserDto | null) => void
  changeGetGame: (page: "create" | "join" | null) => void
  changeMenuPage: (newMenuPage: string) => void
  changeGame: (newGame: GameDto | null) => void
}

interface createGameProps {
  user: UserDto
  changeUser: (newUser: UserDto | null) => void
  changeGetGame: (page: "create" | "join" | null) => void
  changeMenuPage: (newMenuPage: string) => void
  changeGame: (newGame: GameDto | null) => void
}

interface playProps {
  user: UserDto
  changeUser: (newUser: UserDto | null) => void
  changeMenuPage: (newMenuPage: string) => void
  game: GameDto | null
  changeGame: (newGame: GameDto | null) => void
}

const PreGamePage: React.FC<preGamePageProps> = ({ getGame, user, changeUser, changeGetGame, changeMenuPage, game, changeGame }) => {
  const [waitingEffect, setWaitingEffect] = useState<number>(0);

  useEffect(()=>{
    const verifySecondPlayer: () => void = async () => {
      const myGame = await GetGame(game.id);
      if (myGame!.user2 !== null) {
        changeGame(myGame);
      }
    }
    const interval = setInterval(verifySecondPlayer, 2000);
    return () => clearInterval(interval);
  // eslint-disable-next-line
  }, [])

  useEffect(()=>{
    const interval = setInterval(() => {
      setWaitingEffect((prev) => prev === 3 ? 0 : prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line
  }, [])

  const logout: () => void = async () => {
	if (user.status === "Online") updateUser(user.id, {status: "Offline"});
	changeUser(null);
	}

  return (
	<div className='basic-main-ctn'>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
						<MenuIcon onClick={() => changeMenuPage('home')}/>
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						ft_transcendence
					</Typography>
					<Button variant="contained" color="secondary" onClick={() => logout()}>Logout</Button>
					</Toolbar>
				</AppBar>
			</Box>
            <br/>
			&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="contained" onClick={() => changeGame(null)}>Back</Button>
			<br/>
            <h1 style={{display: 'inline', marginLeft: '33%'}}>Waiting for a second player</h1>
            {waitingEffect === 1 && <h1 style={{display: 'inline'}}>.</h1>}
            {waitingEffect === 2 && <h1 style={{display: 'inline'}}>..</h1>}
            {waitingEffect === 3 && <h1 style={{display: 'inline'}}>...</h1>}
            <br/><br/>
			<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
            	<h3>Game options:</h3>
			</Box>
			<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
            	<span style={{color:"#507255"}}>ball speed: </span><span style={{color:"#4AAD52"}}>{game.ballspeed}</span>
            </Box>
			<br/>
			<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
            	<span style={{color:"#507255"}}>map: </span><span style={{color:"#4AAD52"}}>{game.map}</span>
			</Box>
	</div>
	)
}

const JoinGame: React.FC<joinGameProps> = ({ user, changeUser, changeGetGame, changeMenuPage, changeGame }) => {
  const [waitingEffect, setWaitingEffect] = useState<number>(0);

  useEffect(()=>{
    const findGame: () => void = async () => {
      const games = await getAllGames();
      let myGame = games.find(game => game.user2 === null && game.user1.status !== "Offline");
      if (myGame === undefined) return ;
      myGame.user2 = user;
      await updateGame(myGame.id, { user2: myGame.user2 });
      changeGame(myGame);
    }
    const interval = setInterval(findGame, 2000);
    return () => clearInterval(interval);
  // eslint-disable-next-line
  }, [])

  useEffect(()=>{
    const interval = setInterval(() => {
      setWaitingEffect((prev) => prev === 3 ? 0 : prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line
  }, [])

  const logout: () => void = async () => {
	if (user.status === "Online") updateUser(user.id, {status: "Offline"});
	changeUser(null);
	}

  return (
	<div className='basic-main-ctn'>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
						<MenuIcon onClick={() => changeMenuPage('home')}/>
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						ft_transcendence
					</Typography>
					<Button variant="contained" color="secondary" onClick={() => logout()}>Logout</Button>
					</Toolbar>
				</AppBar>
			</Box>
            <br/>
			&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="contained" onClick={() => changeGetGame(null)}>Back</Button>
			<br/>
            <h1 style={{display: 'inline', marginLeft: '40%'}}>Searching Game</h1>
            {waitingEffect === 1 && <h1 style={{display: 'inline'}}>.</h1>}
            {waitingEffect === 2 && <h1 style={{display: 'inline'}}>..</h1>}
            {waitingEffect === 3 && <h1 style={{display: 'inline'}}>...</h1>}
    </div>)
}

const CreateGame: React.FC<createGameProps> = ({ user, changeUser, changeGetGame, changeMenuPage, changeGame }) => {
  const [ballSpeed, setBallSpeed] = useState<number>(1);
  const [map, setMap] = useState<string>("black");

  const onSubmit: () => void = async () => {
    const game = await addGame({user1: user, user2: null, ballspeed: ballSpeed, map: map});
    changeGame(game);
  }

  const logout: () => void = async () => {
	if (user.status === "Online") updateUser(user.id, {status: "Offline"});
	changeUser(null);
	}

  return (
	<div className='basic-main-ctn'>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
						<MenuIcon onClick={() => changeMenuPage('home')}/>
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						ft_transcendence
					</Typography>
					<Button variant="contained" color="secondary" onClick={() => logout()}>Logout</Button>
					</Toolbar>
				</AppBar>
			</Box>
			<br/>
			&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="contained" onClick={() => changeGetGame(null)}>Back</Button>
			<Box sx={{marginRight:'100px'}}>
				<h1>Create&nbsp;Game</h1>
			</Box>
			<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
				<label>Ball Speed: </label>
				<input type="number" step="1" min="1" max="3" value={ballSpeed} onChange={(e)=>setBallSpeed(Number(e.target.value))} required/>
			</Box>
				<br/><br/>
			<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
				<label>Map: </label>
				<select onChange={(e)=>setMap(e.target.value)} required>
					{Maps.map((item)=> <option>{item}</option>)}
				</select>
			</Box>
				<br/><br/>
			<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
				<button type="submit" onClick={()=>onSubmit()}>Create Game</button>
			</Box>
    </div>)
}

const Play: React.FC<playProps> = ({ user, changeUser, changeMenuPage, game, changeGame }) => {
  const [getGame, setGetGame] = useState<"create" | "join" | null>(null);

  const changeGetGame: (page: "create" | "join" | null) => void = (page) => {
    setGetGame(page)
  }

  const quitGame: () => void = async () => {
    if (game === null) return ;
    if (game.user1.id === user.id || game.user2!.id === user.id) removeGame(game.id);
    changeGame(null);
    changeGetGame(null);
  }

  const logout: () => void = async () => {
	if (user.status === "Online") updateUser(user.id, {status: "Offline"});
	changeUser(null);
	}

  if (game !== null && game.user2 !== null) {
    return (<PongGame gameInfos={game} user={user} changeUser={changeUser} back={quitGame} player={(game.user1.id === user.id || game.user2.id === user.id)}/>);
  } else if (game !== null) {
    return <PreGamePage getGame={getGame} user={user} changeUser={changeUser} changeGetGame={changeGetGame} changeMenuPage={changeMenuPage} game={game} changeGame={changeGame}/>;
  } else if (getGame === null) {
    return (
		<div className='basic-main-ctn'>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
						<MenuIcon onClick={() => changeMenuPage('home')}/>
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						ft_transcendence
					</Typography>
					<Button variant="contained" color="secondary" onClick={() => logout()}>Logout</Button>
					</Toolbar>
				</AppBar>
			</Box>
			<br/>
			<br/>
            <h1>Play Pong</h1>
			<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
            	<Button variant="contained" onClick={()=>changeGetGame("create")}> Create Game </Button><>&nbsp;&nbsp;</>
            	<Button variant="contained" onClick={()=>changeGetGame("join")}> Join Game </Button>
			</Box>
        </div>);
  } else if (getGame === "create") {
    return <CreateGame user={user} changeUser={changeUser} changeGetGame={changeGetGame} changeMenuPage={changeMenuPage} changeGame={changeGame}/>
  } else {
    return <JoinGame user={user} changeUser={changeUser} changeGetGame={changeGetGame} changeMenuPage={changeMenuPage} changeGame={changeGame}/>
  }
}

export default Play
