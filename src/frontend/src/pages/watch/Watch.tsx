import React, { useState, useEffect } from 'react';
import { GameDto } from "../../api/games/dto/game.dto";
import { UserDto } from "../../api/user/dto/user.dto";
import { getAllUsersRank } from "../../api/user/user.api";
import { getAllGames, getGame } from "../../api/games/games.api";
import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import './Watch.css';

interface profileProps {
	back: () => void,
	changeGame: (newGame: GameDto | null) => void
}

interface liveProps {
  back: () => void,
	changeGame: (newGame: GameDto | null) => void
  activeGames: GameDto[];
}

interface rankingProps {
  back: () => void,
	changeGame: (newGame: GameDto | null) => void
  rankingUsers: UserDto[];
}

const Ranking: React.FC<rankingProps> = ({ back, changeGame, rankingUsers }) => {
  return (
    <div className='watch-extension-ctn'>
    <h2 className='watch-title'>Ranking</h2>
      {rankingUsers.length > 1 ? rankingUsers.slice(0, 5).map((user: UserDto) => <p>{`${user.login} ~ ${user.elo} ELO`}</p>): "Not enough users"}
  </div>
  );
}

const Live:React.FC<liveProps> = ({ back, changeGame, activeGames }) => {

  const watchGame: (game: GameDto) => void = async (game) => {
		const latestGame = await getGame(game.id);
    if (latestGame !== null && latestGame.user1.status === "In a game"
      && latestGame.user2 !== null && latestGame.user2.status === "In a game") changeGame(latestGame);
	}

  return (
    <div className='watch-extension-ctn'>
      <h2 className='watch-title'>Watch live</h2>
      {!activeGames.length ? <p>No Active Games</p> :
      activeGames.map((game)=> <Button onClick={()=>watchGame(game)}><span>
      {<><span >{game.user1.login}</span><span >{' VS '}</span><span >{game.user2 !== null && game.user2.login}</span><span>{` ~ ballspeed: ${game.ballspeed} | map: ${game.map}`}</span></>}</span><br/><br/></Button>)}
    </div>
  );
}

const Watch: React.FC<profileProps> = ({ back, changeGame }) => {
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

  // const logout: () => void = async () => {
	// 	if (profile.status === "Online") await updateUser(profile.id, {status: "Offline"});
	// 	changeUser(null);
	// }

  const isLogout: () => void = async () => {
    window.location.href = "http://localhost:3000";
  }

  	const showR: () => void = () => {
		if (showRanking)
			setShowRanking(false);
		else
      setShowRanking(true);
	}

	const showL: () => void = () => {
		if (showLive)
			setShowLive(false);
		else
      setShowLive(true);
	}

	const changeExtension: (ext: string) => void = (ext) => {
		if (ext === "live")
		{
			setShowRanking(false);
			showL();
		}
		else
		{
			setShowLive(false);
			showR();
		}
	}

  return (
    <div className='full-watch-main-ctn'>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="secondary">
          <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => back()}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ft_transcendence
          </Typography>
          <Button variant="contained" color="primary" onClick={() => isLogout()}>Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div className='profile-main-ctn'>
          <div className='profile-ctn'>
            <h2 className='profile-title'>Watch</h2>
            <Stack spacing={2}>
              <Button variant="contained" color="primary"onClick={() => changeExtension("ranking")}>Ranking</Button>
              <Button variant="contained" color="primary" onClick={() => changeExtension("live")}>Watch live</Button>
            </Stack>
          </div>
          {showLive && <Live back={back} changeGame={changeGame} activeGames={activeGames}/>}
          {showRanking && <Ranking back={back} changeGame={changeGame} rankingUsers={rankingUsers}/>}
      </div>
    </div>
  );
}

//   return (
//           <div>
//             <button onClick={()=>{back()}}>Back</button>
// 						<h1>Ranking</h1>
// 						{rankingUsers.length > 1 ? rankingUsers.slice(0, 5).map((user: UserDto) => <p>{`${user.login} ~ ${user.elo} ELO`}</p>): "Not enough users"}
//             <h1>Watch Live</h1>
//             {!activeGames.length ? <p>No Active Games</p> :
//               activeGames.map((game)=> <Button onClick={()=>watchGame(game)}><span>
//               {<><span >{game.user1.login}</span><span >{' VS '}</span><span >{game.user2 !== null && game.user2.login}</span><span>{` ~ ballspeed: ${game.ballspeed} | map: ${game.map}`}</span></>}</span><br/><br/></Button>)}
//           </div>);
// }

export default Watch;