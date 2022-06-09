import { OmitType } from "@nestjs/mapped-types";
import { GamesEntity } from "../entities/games.entity";

/* We're creating a new class called CreateGameDto that extends the GamesEntity
class, but omits the id property */
export class CreateGameDto extends OmitType(GamesEntity, ["id"]) {}
