import React, { useState, useEffect } from 'react';
import { GameDto } from "../../api/games/dto/game.dto";
import { addGame, getAllGames, getGame, getGame as GetGame, removeGame, updateGame } from "../../api/games/games.api";
import { UserDto } from "../../api/user/dto/user.dto";
import PongGame from "./gameFunc/PongGame";
import { AppBar, Box, Button, Toolbar, Typography, IconButton, Stack, FormControl, InputLabel, Select, MenuItem, FormHelperText, List, Card, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { getAllUsersRank } from "../../api/user/user.api";
import MenuIcon from '@mui/icons-material/Menu';
import "./Play.css";

const Maps = ['black', 'white', 'winter', 'summer', 'night'];

interface preGamePageProps {
  getGame: "create" | "join" | null
  changeGetGame: (page: "create" | "join" | null) => void
  changeMenuPage: (newMenuPage: string) => void
  game: GameDto
  changeGame: (newGame: GameDto | null) => void
  logout: () => void
}

interface joinGameProps {
  user: UserDto
  changeGame: (newGame: GameDto | null) => void
  logout: () => void
}

interface createGameProps {
  user: UserDto
  changeGame: (newGame: GameDto | null) => void
}

interface playProps {
  user: UserDto
  changeUser: (newUser: UserDto | null) => void
  changeMenuPage: (newMenuPage: string) => void
  game: GameDto | null
  changeGame: (newGame: GameDto | null) => void
  logout: () => void
}

interface PongProps {
  gameInfos: GameDto,
  user: UserDto,
  changeUser: (newUser: UserDto | null) => void,
  back: () => void, player: boolean,
  changeMenuPage: (newMenuPage: string) => void,
  logout: () => void
}

interface liveProps {
	changeGame: (newGame: GameDto | null) => void,
  activeGames: GameDto[]
}

interface rankingProps {
  rankingUsers: UserDto[]
}

const Pong: React.FC<PongProps> = ({gameInfos, user, changeMenuPage, changeUser, back, logout}) => {

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
          <Button variant="contained" color="primary" onClick={() => logout()}>Logout</Button>
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

const PreGamePage: React.FC<preGamePageProps> = ({ getGame, changeGetGame, changeMenuPage, game, changeGame, logout }) => {
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
}

const JoinGame: React.FC<joinGameProps> = ({ user, changeGame }) => {
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
      <h2 className='play-title'>Quick game</h2>
        <h1 style={{display: 'inline'}}>Searching Game</h1>
        {waitingEffect === 1 && <h1 style={{display: 'inline'}}>.</h1>}
        {waitingEffect === 2 && <h1 style={{display: 'inline'}}>..</h1>}
        {waitingEffect === 3 && <h1 style={{display: 'inline'}}>...</h1>}
        {waitingEffect === 4 && <h1 style={{display: 'inline'}}>&nbsp;</h1>}
    </div>
  );
}

const CreateGame: React.FC<createGameProps> = ({ user, changeGame }) => {
  const [ballSpeed, setBallSpeed] = useState<number>(1);
  const [map, setMap] = useState<string>("black");

  const onSubmit: () => void = async () => {
    const game = await addGame({user1: user, user2: null, ballspeed: ballSpeed, map: map});
    changeGame(game);
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
          {Maps.map((item, key)=> <MenuItem key={key} value={item}>{item}</MenuItem>)}
          </Select>
          <FormHelperText>Set the map design</FormHelperText>
        </FormControl>
        <Button variant="contained" type="submit" onClick={()=>onSubmit()}>Create</Button>
      </Stack>
    </div>
  );
}

const Ranking: React.FC<rankingProps> = ({ rankingUsers }) => {
  return (
    <div className='play-extension-ctn'>
    <h2 className='play-title'>Ranking</h2>
    <Card sx={{minWidth: 300}} >
						<List sx={{ width: '100%', overflow: 'auto', maxHeight: 500}}>
							{rankingUsers.length ? rankingUsers.map((item, key)=> 
							<ListItem key={key}>
								<ListItemAvatar>
								<Avatar src={item.avatar}/>
								</ListItemAvatar>
								<ListItemText primary={item.login} secondary={`${item.elo} ELO`}/>
							</ListItem>
							) : <p>Not enough users</p>}
						</List>
					</Card>
  </div>
  );
}

const Live:React.FC<liveProps> = ({ changeGame, activeGames }) => {

  const watchGame: (game: GameDto) => void = async (game) => {
		const latestGame = await getGame(game.id);
    if (latestGame !== null && latestGame.user1.status === "In a game"
      && latestGame.user2 !== null && latestGame.user2.status === "In a game") changeGame(latestGame);
	}

  return (
    <div className='play-extension-ctn'>
      <h2 className='play-title'>Watch live</h2>
      {!activeGames.length ? <p>No Active Games</p> :
      activeGames.map((game, key)=> <Button key={key} variant="outlined" onClick={()=>watchGame(game)}><span>
      {<><span >{game.user1.login}</span><span >{' VS '}</span><span >{game.user2 !== null && game.user2.login}</span><span>{` ~ ballspeed: ${game.ballspeed} | map: ${game.map}`}</span></>}</span><br/><br/></Button>)}
    </div>
  );
}

const Play: React.FC<playProps> = ({ user, changeUser, changeMenuPage, game, changeGame, logout }) => {
  const [getGame, setGetGame] = useState<"create" | "join" | null>(null);
  const [showJoin, setShowJoin] = useState<boolean>(false);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [activeGames, setActiveGames] = useState<GameDto[]>([]);
	const [rankingUsers, setRankingUsers] = useState<UserDto[]>([]);
  const [showRanking, setShowRanking] = useState<boolean>(false);
  const [showLive, setShowLive] = useState<boolean>(false);

  useEffect(() => {
    const getActiveGames: () => void = async () => {
      let games: GameDto[] = await getAllGames();
      games = games.filter((game)=> game.user1.status === "In a game" && game.user2 !== null
        && game.user2.status === "In a game")
      setActiveGames(games);
    }
    getActiveGames(); //Instantly get it when entering page
    const interval = setInterval(getActiveGames, 5000);
		return () => clearInterval(interval);
  }, [])

	useEffect(() => {
		const getRanking: () => void = async () => {
			setRankingUsers((await getAllUsersRank()))
		}
		getRanking();
		const interval = setInterval(getRanking, 5000);
		return () => clearInterval(interval);
	}, [])

  const changeGetGame: (page: "create" | "join" | null) => void = (page) => {
    setGetGame(page)
  }

  const quitGame: () => void = async () => {
    if (game === null) return ;
    if (game.user1.id === user.id || game.user2!.id === user.id) removeGame(game.id);
    changeGame(null);
    changeGetGame(null);
  }

  const changeExtension: (ext: string) => void = (ext) => {
		if (ext === "create")
		{
      changeGetGame("create")
			setShowJoin(false);
      setShowRanking(false);
      setShowLive(false);
			setShowCreate(!showCreate);
		}
		else if (ext === "join")
		{
      changeGetGame("join");
			setShowCreate(false);
      setShowRanking(false);
      setShowLive(false);
			setShowJoin(!showJoin);
		}
    else if (ext === "live")
    {
			setShowCreate(false);
      setShowJoin(false);
      setShowRanking(false);
			setShowLive(!showLive);
    }
    else if (ext === "ranking")
    {
			setShowCreate(false);
      setShowJoin(false);
      setShowLive(false);
			setShowRanking(!showRanking);
    }
	}

  if (game !== null && game.user2 !== null) {
    return (<Pong gameInfos={game} user={user} changeMenuPage={changeMenuPage} changeUser={changeUser} back={quitGame} player={(game.user1.id === user.id || game.user2.id === user.id)} logout={logout}/>);
  }
  else if (game !== null) {
    return <PreGamePage getGame={getGame} changeGetGame={changeGetGame} changeMenuPage={changeMenuPage} game={game} changeGame={changeGame} logout={logout} />;
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
            <h2 className='play-title'>Pong</h2>
            <Stack spacing={2}>
              <Button variant="contained" onClick={()=>changeExtension("ranking")}> Ranking </Button>
              <Button variant="contained" onClick={()=>changeExtension("join")}> Quick Game </Button>
              <Button variant="contained" onClick={()=>changeExtension("create")}> Create Game </Button>
              <Button variant="contained" onClick={()=>changeExtension("live")}> Watch live </Button>
            </Stack>
          </div>
          {showCreate && <CreateGame user={user} changeGame={changeGame} />}
          {showJoin && <JoinGame user={user} changeGame={changeGame} logout={logout} />}
          {showLive && <Live changeGame={changeGame} activeGames={activeGames}/>}
          {showRanking && <Ranking rankingUsers={rankingUsers}/>}
        </div>
      </div>
    );
  }
}

export default Play
