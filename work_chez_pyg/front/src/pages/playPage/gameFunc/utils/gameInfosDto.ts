export interface GameInfosDto {
	ballX: number,
	ballY: number,
	p1y: number,
	p1x: number,
	p2y: number,
	p2x: number,
	scoreP1: number,
	scoreP2: number,
}
 
export interface playerScoreDto {
	win: {
		p: number,
		score: number,
	}
	loose: {
		p: number,
		score: number,
	}
}