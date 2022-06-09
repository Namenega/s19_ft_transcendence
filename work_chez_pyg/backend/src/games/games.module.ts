import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GamesEntity } from "./entities/games.entity";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";

@Module({
	imports: [TypeOrmModule.forFeature([GamesEntity])],
	controllers: [GamesController],
	providers: [GamesService]
  })
  export class GamesModule {}
