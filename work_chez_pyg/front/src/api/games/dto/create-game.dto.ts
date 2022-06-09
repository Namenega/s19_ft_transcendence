import { GameDto } from "./game.dto";

export type CreateGameDto = Omit<GameDto, "id">;