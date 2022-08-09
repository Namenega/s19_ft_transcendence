import { GameInfosDto } from "./dto/game-settings-dto";
import * as CONSTS from './dto/game-const.constants';
import { clearInterval } from 'timers';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

const lodash = require('lodash');

var startGameInfos: GameInfosDto = {
	ballX: CONSTS.GAME_WIDTH / 2,
	ballY: CONSTS.GAME_HEIGHT / 2,
	p1y: (CONSTS.GAME_HEIGHT / 2) - (CONSTS.PLAYER_HEIGHT / 2),
	p1x: 0,
	p2y: (CONSTS.GAME_HEIGHT / 2) - (CONSTS.PLAYER_HEIGHT / 2),
	p2x: CONSTS.GAME_WIDTH - 15,
	scoreP1: 0,
	scoreP2: 0,
}

/* It's a class that manages the game */
class gameRender {
	private gameInfos: GameInfosDto;
	private velocityX: number;
	private velocityY: number;
	private basicSpeed: number;
	private speed: number;
	private radius: number;
	private playing: boolean = true;
	private loop = null;
	public status: string;

	constructor (basic_infos: GameInfosDto, ballspeed: number) {
		this.gameInfos = basic_infos;
		this.basicSpeed = ballspeed * 3;
		this.velocityX = this.basicSpeed * (Math.random() < 0.5 ? 1 : -1);
		this.velocityY = 0;
		this.speed = this.basicSpeed;
		this.radius = CONSTS.BALL_RADIUS;
		this.status = 'w';
	}

	get getLoop() { return this.loop; }
	set setLoop(content: any) { this.loop = content; }

	get getStatus() { return this.status; }
	set setStatut(status: string) { this.status = status; }

	/**
	 * If the ball is within the player's bounding box, then there is a collision
	 * @param pos - the position of the player
	 * @returns A boolean value.
	 */
	public collision(pos: {x: number, y: number})
	{
		var ptop = pos.y;
		var pbottom = pos.y + CONSTS.PLAYER_HEIGHT;
		var pleft = pos.x;
		var pright = pos.x + CONSTS.PLAYER_WIDTH;

		var btop = this.gameInfos.ballY - this.radius;
		var bbottom = this.gameInfos.ballY + this.radius;
		var bleft = this.gameInfos.ballX - this.radius;
		var bright = this.gameInfos.ballX + this.radius;

		return (bright > pleft && bbottom > ptop && btop < pbottom && bleft < pright);
	}

	/**
	 * It's a function to update the ball position and check if there's a collision
	 * with the player
	 * @returns The gameInfosReturn is being returned.
	 */
	public update() {
		this.gameInfos.ballX += this.velocityX;
		this.gameInfos.ballY += this.velocityY;

		if (this.gameInfos.ballY + this.radius > CONSTS.GAME_HEIGHT || this.gameInfos.ballY - this.radius < 0)
			this.velocityY = -this.velocityY;

		let player = (this.gameInfos.ballX < CONSTS.GAME_WIDTH / 2 ? {x: this.gameInfos.p1x, y: this.gameInfos.p1y} : {x: this.gameInfos.p2x, y: this.gameInfos.p2y}); //player

		/* It's a collision detection. */
		if (this.collision(player))
		{
			var collidepoint = this.gameInfos.ballY - (player.y + CONSTS.PLAYER_HEIGHT/2);
			collidepoint = collidepoint / (CONSTS.PLAYER_HEIGHT / 2);

			var angleRad = (Math.PI/4) * collidepoint;

			var direction = (this.gameInfos.ballX < CONSTS.GAME_WIDTH / 2 ? 1 : -1);

			this.velocityX = direction * (this.speed * Math.cos(angleRad));
			this.velocityY = this.speed * Math.sin(angleRad);

			if (this.speed <= 14) { this.speed += 0.5; }
		}

		/* It's a collision detection. */
		if (this.gameInfos.ballX - this.radius < 0)
		{
			this.gameInfos.scoreP2 += 1;
			this.resetBall();
		}
		else if (this.gameInfos.ballX + this.radius > CONSTS.GAME_WIDTH)
		{
			this.gameInfos.scoreP1 += 1;
			this.resetBall();
		}

		/* It's a condition to know if the game is finish. */
		if (this.gameInfos.scoreP1 >= 11 || this.gameInfos.scoreP2 >= 11) {
			this.playing = false;
		}

		var gameInfosReturn = this.gameInfos;
		return (gameInfosReturn);
	}

	/**
	 * It resets the ball's position and velocity to the center of the screen, and
	 * sets the velocity to the basic speed in the direction of the player who scored
	 * the last point
	 */
	public resetBall() {
		this.gameInfos.ballX = CONSTS.GAME_WIDTH / 2;
		this.gameInfos.ballY = CONSTS.GAME_HEIGHT / 2;
		this.velocityX = (this.velocityX > 0) ? -this.basicSpeed : this.basicSpeed;
		this.velocityY = 0;
		this.speed = this.basicSpeed;
	}

	/**
	 * If the position is less than 0, set the position to 0. If the position is
	 * greater than the game height minus the player height, set the position to the
	 * game height minus the player height. Otherwise, set the position to the
	 * position
	 * @param {number} pos - the position of the player
	 */
	public updatePos1 (pos: number) {
		if (pos < 0) {
			this.gameInfos.p1y = 0;
		}
		else if (pos > CONSTS.GAME_HEIGHT - (CONSTS.PLAYER_HEIGHT)) {
			this.gameInfos.p1y = CONSTS.GAME_HEIGHT - CONSTS.PLAYER_HEIGHT;
		}
		else {
			this.gameInfos.p1y = pos;
		}
	}

	/**
	 * It updates the position of the second player
	 * @param {number} pos - the position of the player
	 */
	public updatePos2 (pos: number) {
		if (pos < 0) {
			this.gameInfos.p2y = 0;
		}
		else if (pos > CONSTS.GAME_HEIGHT - (CONSTS.PLAYER_HEIGHT)) {
			this.gameInfos.p2y = CONSTS.GAME_HEIGHT - CONSTS.PLAYER_HEIGHT;
		}
		else {
			this.gameInfos.p2y = pos;
		}

	}

	/**
	 * It checks if the game is finished.
	 * @returns The function isEnd() returns a boolean value.
	 */
	public isEnd () { //if playing = true the game is not finish :)
		return (this.playing ? false : true);
	}

	/**
	 * It returns an object containing the winner and the loser of the game
	 * @returns An object with two properties: win and loose.
	 */
	public getScore() {
		var tmp_win = this.gameInfos.scoreP1 > this.gameInfos.scoreP2 ? {p: 1, score: this.gameInfos.scoreP1} : {p: 2, score: this.gameInfos.scoreP2};
		var tmp_loose = tmp_win.p == 1 ? {p: 2, score: this.gameInfos.scoreP2} : {p: 1, score: this.gameInfos.scoreP1};

		return ( {win: tmp_win, loose: tmp_loose} );
	}
}

@WebSocketGateway(80, { namespace: 'game' })
export class GameGateway {
	@WebSocketServer()
	server: Server;

	public games = {} ;

	/* It's a function that is called when the client sends a message with the name
	'startgame'. */
	@SubscribeMessage('startgame')
	connectPlayer(client: Socket, message: any): void {

		/* It's a condition to check if the game is already created. If it's not, it
		creates a new game. */
		if (this.games[message.room] == undefined) { //status :	w = waiting | p = playing | e = end
			this.games[message.room] = {players: {p1: false, p2: false}, game: new gameRender(lodash.cloneDeep(startGameInfos), message.speed), loop: null, room: message.room};
		}

		/* It's a condition to check if the player 1 and player 2 are connected. */
		if (message.player == 1) { //check if p1 and p2 are connected
			this.games[message.room].players.p1 = true;
		}
		else if (message.player == 2) {
			this.games[message.room].players.p2 = true;
		}

		/* It's a condition to check if the player 1 and player 2 are connected. If they
		are, it starts the game. */
		if (this.games[message.room].players.p1 == true && this.games[message.room].players.p2 == true && (message.player == 1 || message.player == 2) && this.games[message.room].game.status == 'w') {
			this.games[message.room].game.status = 'p';
			this.games[message.room].loop = setInterval((room: string) => this.sendGameData(room), 1000/60, message.room);
		}
		else if (this.games[message.room] != undefined && this.games[message.room].status == 'e') { //if someone refresh the page this condition avoid to duplicate game with a same room id and just send the final score of the current game
				this.server.to(message.room).emit('finalScore', this.games[message.room].game.getScore());
		}
		return ;
	}

	/**
	 * It sends the game data to the clients
	 * @param {string} room - The room that the game is in.
	 */
	sendGameData(room: string) {
		var data = this.games[room].game.update();

		if (this.games[room].game.isEnd()) {
			this.games[room].game.status = 'e';
			this.clearGame(room);
			this.server.to(room).emit('finalScore', this.games[room].game.getScore());
		}
		else {
			this.server.to(room).emit('gameData', data);
		}
	}

	/* It's a function that is called when the client sends a message with the name
	'stopGame'. */
	@SubscribeMessage('stopGame')
	stopGame(client: Socket, message: {room: string, username: string }): void {

		if (this.games[message.room] != undefined) {
			this.clearGame(message.room);
		}

		if (this.games[message.room] != undefined) {
			if (this.games[message.room].game.status != 'e') {
				this.server.to(message.room).emit('userLeft', message.username);
			}
			delete this.games[message.room];
		}
	}

	/**
	 * This function clears the game loop for a given room
	 * @param {string} room - The room the game is in.
	 */
	public clearGame(room: string) {
		if (this.games[room].loop != null) {

			clearInterval(this.games[room].loop);
			this.games[room].loop = null;
		}
	}

	/* It's a function that is called when the client sends a message with the name
	'pos1'. */
	@SubscribeMessage('pos1')
	handlePosP1(client: Socket, message: {room: string, pos: number}): void {
		if ( this.games[message.room] != undefined)
			this.games[message.room].game.updatePos1(message.pos);
	}

	/* It's a function that is called when the client sends a message with the name
	'pos2'. */
	@SubscribeMessage('pos2')
	handlePosP2(client: Socket, message: {room: string, pos: number}): void {
		if ( this.games[message.room] != undefined)
			this.games[message.room].game.updatePos2(message.pos);
	}

	/* It's a function that is called when the client sends a message with the name
	'joinRoom'. */
	@SubscribeMessage('joinRoom')
	joinRoom(client: Socket, room: string): void {
		client.join(room);
	}

	/* It's a function that is called when the client sends a message with the name
	'leaveRoom'. */
	@SubscribeMessage('leaveRoom')
	leaveRoom(client: Socket, room: string): void {
		client.leave(room);
	}
}
