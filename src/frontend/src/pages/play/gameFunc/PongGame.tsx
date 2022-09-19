import { useEffect, useState } from 'react';
import { connect, startGame, joinRoom, stopGame, disconnect } from "../../../socket/game/game.socket";
import { GameDto } from "../../../api/games/dto/game.dto";
import { UserDto } from "../../../api/user/dto/user.dto";
import { updateUser } from "../../../api/user/user.api";
import { GameInfosDto, playerScoreDto } from "./utils/gameInfosDto";
import { Game } from "./Game";
import { addMatchHistory, createNewMatchHistory, getMatchHistoryOfUser } from "../../../api/match-history/match-history.api";
import { getUser } from "../../../api/user/user.api";
import { removeGame } from "../../../api/games/games.api";
import { Button } from '@mui/material';

const PongGame = (props : {gameInfos: GameDto, user: UserDto, changeUser: (newUser: UserDto | null) => void, back: () => void, player: boolean}) => {
	const [endGame, setEndGame] = useState<boolean>(false);
	const [userDisconnected, setUserDisconnected] = useState<boolean>(false);

	useEffect(() => {
		let user2 = props.user.id === props.gameInfos.user1.id ? props.gameInfos.user2! : props.gameInfos.user1
		const verifyOtherUserDisconnect: () => Promise<void> = async () => {
			let latestUser2 = await getUser(user2.id);
			if ((latestUser2 === null || latestUser2.status !== "In a game")) {
				setUserDisconnected(true);
			}
    }
    const interval = setInterval(verifyOtherUserDisconnect, 2000);
    return () => clearInterval(interval);
	// eslint-disable-next-line
	}, [])

 	useEffect( () => {
		var p: number = 0;
		if (props.user.login === props.gameInfos.user1.login)
			p = 1;
		else if (props.user.login === props.gameInfos.user2!.login)
			p = 2;

		var socket = connect();
		var game = new Game(props.gameInfos, props.user.login, socket); // classe avec les toutes les infos de la game

		let user2 = props.user.id === props.gameInfos.user1.id ? props.gameInfos.user2! : props.gameInfos.user1;

		joinRoom(socket, props.gameInfos.id.toString());
		if (p !== 0) {
			startGame(socket, {room: props.gameInfos.id.toString(), player: p, speed: props.gameInfos.ballspeed});
		}
		socket.on('gameData', (data: GameInfosDto) => {
			game.drawGame(data);
		})
		socket.on('finalScore', (scores: playerScoreDto) => {
			game.drawEnd(scores);
			const scoreToDatabase: () => void = async () => {
				let numberOfMatchHistoryOpponent: number = (await getMatchHistoryOfUser(user2.login)).length;
				removeGame(props.gameInfos.id);
				let latestUser2 = await getUser(user2.id);
				if (latestUser2 === null || latestUser2.status !== "In a game" || userDisconnected) return ;
				addMatchHistory(createNewMatchHistory(props.user,
					game.myNum === scores.win.p ? scores.win.score : scores.loose.score,
					user2.id,
					game.myNum === scores.win.p ? scores.loose.score : scores.win.score));
				if (game.myNum === scores.win.p) {
					updateUser(props.user.id, {numberOfWin: props.user.numberOfWin + 1, elo: props.user.elo + (32 * (1 - (1 / (1 + Math.pow(10, (user2.elo - props.user.elo) / 400))))) | 0});
				} else {
					updateUser(props.user.id, {numberOfLoss: props.user.numberOfLoss + 1, elo: props.user.elo + (32 * (0 - (1 / (1 + Math.pow(10, (user2.elo - props.user.elo) / 400))))) | 0});
				}
				await new Promise(r => setTimeout(r, 1000));
				let numberOfMatchHistoryOpponentAfter: number = (await getMatchHistoryOfUser(user2.login)).length;
				if (numberOfMatchHistoryOpponent === numberOfMatchHistoryOpponentAfter) {
					addMatchHistory(createNewMatchHistory(user2,
						game.myNum !== scores.win.p ? scores.win.score : scores.loose.score,
						props.user.id,
						game.myNum !== scores.win.p ? scores.loose.score : scores.win.score));
						if (game.myNum !== scores.win.p) {
							updateUser(user2.id, {numberOfWin: user2.numberOfWin + 1, elo: user2.elo + (32 * (1 - (1 / (1 + Math.pow(10, (props.user.elo - user2.elo) / 400))))) | 0});
						} else {
							updateUser(user2.id, {numberOfLoss: user2.numberOfLoss + 1, elo: user2.elo + (32 * (0 - (1 / (1 + Math.pow(10, (props.user.elo - user2.elo) / 400))))) | 0});
						}
				}
				let latestUser = await getUser(props.user.id);
				props.changeUser(latestUser);
				setEndGame(true);
			}
			if (props.player) { scoreToDatabase(); } else { setEndGame(true); }
		})
		socket.on('userLeft', (name: string) => {
			game.drawUserLeft(name);
		})
		return () => {
			if (props.player) { // to avoid a viewer to destroy the game if he click on back button
				stopGame(socket, {room: game.myRoom, name: props.user.name});
			}
			disconnect(socket);
		}
	// eslint-disable-next-line
	}, [])

	return (
		<div>
			{(!userDisconnected || endGame) && <canvas id="PongCanvas"></canvas>}
			{userDisconnected && !endGame && <h3>Other user disconnected :(</h3>}
			{<><br/><br/><Button variant="contained" color="primary" onClick={()=>props.back()}>Quit</Button></>}
		</div>
	)
	//quitPermited && 
}

export default PongGame;