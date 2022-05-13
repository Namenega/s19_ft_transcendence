export class CreateUserDto {
	id: number;
	login: string;
	email: string;
	level: number;
	numberOfWin: number;
	numberOfLose: number;
	ratioWinLose: number;
}
