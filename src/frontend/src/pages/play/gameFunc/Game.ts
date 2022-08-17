import { GameDto } from "../../../api/games/dto/game.dto";
import { GameInfosDto, playerScoreDto } from "./utils/gameInfosDto";
import * as CONSTS from "./utils/gameConstants";
import { sendPos1, sendPos2 } from "../../../socket/game/game.socket";

export interface Ime {
	name: string,
	num: number,
}

/*
** "key": ["bg color", "ball/player/scripture color"]
*/
const maps: any= {
	"black": ["#000000", "#FFFFFF"],
	"white": ["#FFFFFF", "#000000"],
	"winter": ["#b3ffff", "#1d4161"],
	"summer": ["#ff9400", "#001826"],
	"night": ["#001841", "#ffc900"],

}

export class Game {
		private room: string;
		private w: number;
		private h: number;
		private can: HTMLCanvasElement;
		private ctx: CanvasRenderingContext2D;
		private nameP1: string = "Player 1 : ";
		private nameP2: string = "Player 2 : ";
		private bgColor: string = "black";
		private scriptureColor: string = "white";
		private me: Ime = {name: "unkown", num: 0}; //name = mon nom et num = player 1 ou player 2
		private bRadius: number = 8; //radius de la ball a changer pour responsive
		private socket: any;
		private coeff: number = 1.0;

		private scores: any = null;
		private end: boolean = false;

		constructor(baseGame: GameDto, name: string, socket: any, w: number = CONSTS.GAME_WIDTH, h: number = CONSTS.GAME_HEIGHT, canId: string = "PongCanvas")
		{
			this.socket = socket;
			this.w = w;
			this.h = h;

			this.nameP1 = baseGame.user1.login.substring(0, 15);
			if (baseGame.user2 !== null)
				this.nameP2 = baseGame.user2.login.substring(0, 15);
			this.room = baseGame.id.toString();
			this.bgColor = maps[baseGame.map][0];
			this.scriptureColor = maps[baseGame.map][1];
			this.me.name = name;
			if (this.me.name === this.nameP1)
				this.me.num = 1;
			else if (this.me.name === this.nameP2)
				this.me.num = 2;
			this.can = document.getElementById(canId)  as HTMLCanvasElement;
			this.ctx = this.can.getContext('2d') as CanvasRenderingContext2D;
			this.can.addEventListener("mousemove", this.movePaddle.bind(this));
			this.getCurrSize();
			window.onresize = () => {
				this.getCurrSize();
				if (this.end === true && this.scores !== null) {
					this.drawEnd(this.scores);
				}
			}
		}

		get myNum() {
			return this.me.num;
		}

		get myRoom() {
			return (this.room);
		}

		/*
		** get the current coefficient for responsive
		*/
		public getCurrSize() {

			if (window.innerHeight < 300 || window.innerWidth < 420) {
				this.can.height = 200;
				this.can.width = 280;
				this.coeff = 0.4;
			}
			else if (window.innerHeight < 400 || window.innerWidth < 560) {
				this.can.height = 300;
				this.can.width = 420;
				this.coeff = 0.6;
			}
			else if (window.innerHeight < 500 || window.innerWidth < 700) {
				this.can.height = 400;
				this.can.width = 560;
				this.coeff = 0.8;
			}
			else if (window.innerHeight < 600 || window.innerWidth < 840) {
				this.can.height = 500;
				this.can.width = 700;
				this.coeff = 1;
			}
			else if (window.innerHeight < 700 || window.innerWidth < 980) {
				this.can.height = 600;
				this.can.width = 840;
				this.coeff = 1.2;
			}
			else {
				this.can.height = 700;
				this.can.width = 980;
				this.coeff = 1.4;
			}
		}
		/*
		** Player move function
		*/
		public movePaddle(evt: MouseEvent)
		{
			var rect = this.can.getBoundingClientRect();// || rectTop;

			if (this.me.num === 1) {
				sendPos1(this.socket, {room: this.myRoom, pos: (evt.clientY - rect.top - (CONSTS.PLAYER_HEIGHT / 2)) / this.coeff});
			}
			else if (this.me.num === 2) {
				sendPos2(this.socket, {room: this.myRoom, pos: (((evt.clientY  - rect.top ) / this.coeff) - (((CONSTS.PLAYER_HEIGHT) / 2) * this.coeff ))});
			}
		}

		/*
		** Drawing functions
		*/
		public fillRect(color: string = this.bgColor, x: number = 0, y: number = 0, w: number = this.w, h:number = this.h)
		{
			this.ctx.fillStyle = color;
			this.ctx.fillRect(x, y, w, h);
		}

		public fillCircle (color: string = "white", x: number = CONSTS.GAME_WIDTH / 2, y: number = CONSTS.GAME_HEIGHT / 2, r: number = this.bRadius)
		{
			this.ctx.fillStyle = color;
			this.ctx.beginPath();
			this.ctx.arc(x, y, r, 0, Math.PI*2, false);
			this.ctx.closePath();
			this.ctx.fill();
		}

		public fillWrite (text: string, x: number, y: number, color: string = "white", fontSize: number)
		{
			this.ctx.textAlign = "center";
			this.ctx.fillStyle = color;
			this.ctx.font = fontSize.toString() + "px fantasy";
			this.ctx.fillText(text, x, y);
		}

		public destroyGame()
		{
			this.ctx.clearRect(0, 0, this.can.width, this.can.height);
		}

		/*
		** Update and draw in canvas
		** Take a GameInfos in argument to have websocket infos from backend
		*/
		public drawGame(data: GameInfosDto)
		{
			var height = 0;

			this.destroyGame();
			this.fillRect(this.bgColor, 0, 0, CONSTS.GAME_WIDTH * this.coeff, CONSTS.GAME_HEIGHT * this.coeff);

			this.fillRect(this.scriptureColor, data.p1x * this.coeff, data.p1y * this.coeff, CONSTS.PLAYER_WIDTH * this.coeff, CONSTS.PLAYER_HEIGHT * this.coeff);
			this.fillRect(this.scriptureColor, data.p2x * this.coeff, data.p2y * this.coeff, CONSTS.PLAYER_WIDTH * this.coeff, CONSTS.PLAYER_HEIGHT * this.coeff);

			this.fillWrite(this.nameP1 + "   "  + data.scoreP1.toString(), (CONSTS.GAME_WIDTH / 4) * this.coeff , 35 * this.coeff, this.scriptureColor, Math.floor(30 * this.coeff));
			this.fillWrite(this.nameP2 + "   "  + data.scoreP2.toString(), ((CONSTS.GAME_WIDTH / 4) * 3) * this.coeff , 35 * this.coeff, this.scriptureColor, Math.floor(30 * this.coeff));


			while (height < CONSTS.GAME_HEIGHT * this.coeff) // mid lane
			{
				this.fillRect(this.scriptureColor, ((CONSTS.GAME_WIDTH / 2) - (CONSTS.CENTER_WIDTH / 2)) * this.coeff, height, CONSTS.CENTER_WIDTH * this.coeff, CONSTS.CENTER_HEIGTH * this.coeff);
				height += (CONSTS.CENTER_HEIGTH * 2) * this.coeff;
			}
			this.fillCircle(this.scriptureColor, data.ballX * this.coeff, data.ballY * this.coeff, this.bRadius * this.coeff);
		}

		/*
		** Draw final score
		*/
		public drawEnd(score: playerScoreDto) {
			this.scores = score;
			this.end = true;

			this.destroyGame();
			this.fillRect(this.bgColor, 0, 0, CONSTS.GAME_WIDTH * this.coeff, CONSTS.GAME_HEIGHT * this.coeff);
			this.ctx.font = Math.floor(50 * this.coeff).toString() + "px fantasy";
			this.ctx.fillStyle = this.scriptureColor;
			this.ctx.textAlign = "center";

			var result = "";
			if (score.win.p === this.me.num)
				result = "You win !!!";
			else
				result = "You lose ...";
			this.ctx.fillText(result, 350 * this.coeff, 150 * this.coeff);

			this.ctx.font = Math.floor(35 * this.coeff).toString() +  "px fantasy";
			var output1 = this.nameP1;
			var output2 = this.nameP2;

			output1 += "    :    " + (score.win.p === 1 ? score.win.score :  score.loose.score);
			output2 += "    :    " + (score.win.p === 2 ? score.win.score :  score.loose.score);
			this.ctx.fillText(output1, 350 * this.coeff, 300 * this.coeff);
			this.ctx.fillText(output2, 350 * this.coeff, 350 * this.coeff);
		}

		/*
		** Draw message if an user left the game
		*/
		public drawUserLeft(name: string) {
			this.destroyGame();
			this.fillRect(this.bgColor, 0, 0, CONSTS.GAME_WIDTH * this.coeff, CONSTS.GAME_HEIGHT * this.coeff);
			this.ctx.font = Math.floor(50 * this.coeff).toString() + "px fantasy";
			this.ctx.fillStyle = this.scriptureColor;
			this.ctx.textAlign = "center";

			var msg: string = "Other user has left the game :(";
			this.ctx.fillText(msg,(CONSTS.GAME_WIDTH / 2) * this.coeff, (CONSTS.GAME_HEIGHT / 2) * this.coeff);
		}
}