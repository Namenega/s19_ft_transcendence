import React, { useState, useEffect } from 'react';
import { GameDto } from "../../api/games/dto/game.dto";
import { addGame, getAllGames, getGame as GetGame, removeGame, updateGame } from "../../api/games/games.api";
import { UserDto } from "../../api/user/dto/user.dto";
import PongGame from "./gameFunc/PongGame";
import { AppBar, Box, Button, Toolbar, Typography, IconButton, Stack, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { updateUser } from "../../api/user/user.api";
import MenuIcon from '@mui/icons-material/Menu';
import "./Play.css";

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

interface PongProps {
  gameInfos: GameDto,
  user: UserDto,
  changeUser: (newUser: UserDto | null) => void,
  back: () => void, player: boolean,
  changeMenuPage: (newMenuPage: string) => void
}

const Pong: React.FC<PongProps> = ({gameInfos, user, changeMenuPage, changeUser, back, player}) => {

  const isLogout = () => {
		window.location.href = 'http://localhost:3000'
	}

  const returnToMenu = () => {
    back();
    changeMenuPage("home");
  }

  return (
    <div className='basic-main-ctn'>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="secondary">
          <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => returnToMenu()}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ft_transcendence
          </Typography>
          <Button variant="contained" color="primary" onClick={() => isLogout()}>Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div className='play-main-ctn'>
        <div className='pong-ctn'>
          {gameInfos.user2 !== null && <PongGame gameInfos={gameInfos} user={user} changeUser={changeUser} back={back} player={(gameInfos.user1.id === user.id || gameInfos.user2.id === user.id)}/>}
        </div>
      </div>
    </div>
  );
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
      setWaitingEffect((prev) => prev === 4 ? 1 : prev + 1);
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
        <AppBar position="static" color="secondary">
          <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => changeMenuPage("home")}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ft_transcendence
          </Typography>
          <Button variant="contained" color="primary" onClick={() => logout()}>Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div className='play-main-ctn'>
        <div className='play-ctn'>
          <h1 className='play-title'>Waiting for an opponent</h1>
          <Stack spacing={2}>
            <Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
              {waitingEffect === 1 && <h1 style={{display: 'inline'}}>.</h1>}
              {waitingEffect === 2 && <h1 style={{display: 'inline'}}>..</h1>}
              {waitingEffect === 3 && <h1 style={{display: 'inline'}}>...</h1>}
              {waitingEffect === 4 && <h1 style={{display: 'inline'}}>&nbsp;</h1>}
            </Box>
            <Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
              <h3>Game options:</h3>
            </Box>
            <Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
              <span style={{color:"#507255"}}>ball speed: &nbsp;</span><span style={{color:"#4AAD52"}}>{game.ballspeed}</span>
            </Box>
            <Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
              <span style={{color:"#507255"}}>map: &nbsp;</span><span style={{color:"#4AAD52"}}>{game.map}</span>
            </Box>
            <br/>
            <Button variant="contained" onClick={() => {changeGame(null); removeGame(game.id); (getGame === "join" && changeGetGame(null))}}>Quit</Button>
          </Stack>
        </div>
      </div>
    </div>
	);

  // <br/>
  // &nbsp;&nbsp;&nbsp;&nbsp;<Button variant="contained" onClick={() => {changeGame(null); removeGame(game.id); (getGame === "join" && changeGetGame(null))}}>Back</Button>
  // <br/>
  //       <h1 style={{display: 'inline', marginLeft: '33%'}}>Waiting for a second player</h1>
  //       {waitingEffect === 1 && <h1 style={{display: 'inline'}}>.</h1>}
  //       {waitingEffect === 2 && <h1 style={{display: 'inline'}}>..</h1>}
  //       {waitingEffect === 3 && <h1 style={{display: 'inline'}}>...</h1>}
  //       <br/><br/>
  // <Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
  //         <h3>Game options:</h3>
  // </Box>
  // <Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
  //         <span style={{color:"#507255"}}>ball speed: </span><span style={{color:"#4AAD52"}}>{game.ballspeed}</span>
  //       </Box>
  // <br/>
  // <Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
  //         <span style={{color:"#507255"}}>map: </span><span style={{color:"#4AAD52"}}>{game.map}</span>
  // </Box>
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
      setWaitingEffect((prev) => prev === 4 ? 1 : prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line
  }, [])

  return (
    <div className='play-extension-ctn'>
      <h2 className='play-title'>Join game</h2>
        <h1 style={{display: 'inline'}}>Searching Game</h1>
        {waitingEffect === 1 && <h1 style={{display: 'inline'}}>.</h1>}
        {waitingEffect === 2 && <h1 style={{display: 'inline'}}>..</h1>}
        {waitingEffect === 3 && <h1 style={{display: 'inline'}}>...</h1>}
        {waitingEffect === 4 && <h1 style={{display: 'inline'}}>&nbsp;</h1>}
    </div>
  );
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
    <div className='play-extension-ctn'>
      <h2 className='play-title'>Create game</h2>
      <br/>
      <Stack spacing={2}>
        <FormControl>
          <InputLabel>Speed</InputLabel>
          <Select value={ballSpeed} label="Speed" onChange={(e)=>setBallSpeed(Number(e.target.value))}>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
          <FormHelperText>Set the ball speed</FormHelperText>
        </FormControl>
        <FormControl>
          <InputLabel>Map</InputLabel>
          <Select value={map} label="Map" onChange={(e)=>setMap(String(e.target.value))}>
          {Maps.map((item)=> <MenuItem value={item}>{item}</MenuItem>)}
          </Select>
          <FormHelperText>Set the map design</FormHelperText>
        </FormControl>
        <Button variant="contained" type="submit" onClick={()=>onSubmit()}>Create</Button>
      </Stack>
    </div>
  );

  {/* <br/>
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
    </div> */}
}

const Play: React.FC<playProps> = ({ user, changeUser, changeMenuPage, game, changeGame }) => {
  const [getGame, setGetGame] = useState<"create" | "join" | null>(null);
  const [showJoin, setShowJoin] = useState<boolean>(false);
  const [showCreate, setShowCreate] = useState<boolean>(false);

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

  const showJoinGame: () => void = () => {
		if (showJoin)
			setShowJoin(false);
		else
			setShowJoin(true);
	}

	const showCreateGame: () => void = () => {
		if (showCreate)
			setShowCreate(false);
		else
			setShowCreate(true);
	}

  const showPongGame: () => void = () => {
		// if (showCreate)
		// 	setShowCreate(false);
		// else
		// 	setShowJoin(true);
	}

  const changeExtension: (ext: string) => void = (ext) => {
		if (ext === "create")
		{
      changeGetGame("create")
			setShowJoin(false);
			showCreateGame();
		}
		else if (ext === "join")
		{
      changeGetGame("join");
			setShowCreate(false);
			showJoinGame();
		}
	}

  if (game !== null && game.user2 !== null) {
    return (<Pong gameInfos={game} user={user} changeMenuPage={changeMenuPage} changeUser={changeUser} back={quitGame} player={(game.user1.id === user.id || game.user2.id === user.id)}/>);
  }
  else if (game !== null) {
    return <PreGamePage getGame={getGame} user={user} changeUser={changeUser} changeGetGame={changeGetGame} changeMenuPage={changeMenuPage} game={game} changeGame={changeGame}/>;
  }
  else {
    return (
      <div className='basic-main-ctn'>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="secondary">
            <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => changeMenuPage("home")}>
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ft_transcendence
            </Typography>
            <Button variant="contained" color="primary" onClick={() => logout()}>Logout</Button>
            </Toolbar>
          </AppBar>
        </Box>
      	<div className='play-main-ctn'>
          <div className='play-ctn'>
            <h2 className='play-title'>Play</h2>
            <Stack spacing={2}>
              <Button variant="contained" onClick={()=>changeExtension("create")}> Create Game </Button>
            	<Button variant="contained" onClick={()=>changeExtension("join")}> Join Game </Button>
            </Stack>
          </div>
          {showCreate && <CreateGame user={user} changeUser={changeUser} changeGetGame={changeGetGame} changeMenuPage={changeMenuPage} changeGame={changeGame}/>}
          {showJoin && <JoinGame user={user} changeUser={changeUser} changeGetGame={changeGetGame} changeMenuPage={changeMenuPage} changeGame={changeGame}/>}
        </div>
      </div>
    );
  }
}

export default Play


{/* <br/>
			<br/>
            <h1>Play Pong</h1>
			<Box sx={{flexGrow: 1, display:'flex', justifyContent: 'center'}}>
            	<Button variant="contained" onClick={()=>changeGetGame("create")}> Create Game </Button><>&nbsp;&nbsp;</>
            	<Button variant="contained" onClick={()=>changeGetGame("join")}> Join Game </Button>
			</Box>
        </div> */}
