import { PartialType } from "@nestjs/mapped-types";
import { CreateGameDto } from "./create-game.dto";

/* `UpdateGameDto` is a class that extends `CreateGameDto` and is a partial of
`CreateGameDto` */
export class UpdateGameDto extends PartialType(CreateGameDto) {}
