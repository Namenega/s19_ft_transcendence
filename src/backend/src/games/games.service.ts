import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { GamesEntity } from "./entities/games.entity";

/* It's a service that uses the GamesRepo to create, find, update, and delete games */
@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(GamesEntity)
        private GamesRepo: Repository<GamesEntity>
    ) {}

    /**
     * It takes a CreateGameDto object, saves it to the database, and returns a
     * GamesEntity object
     * @param {CreateGameDto} createGameDto - CreateGameDto - This is the DTO that
     * we created earlier.
     * @returns The game that was created.
     */
    async create(createGameDto: CreateGameDto): Promise<GamesEntity> {
        try {
            return await this.GamesRepo.save(createGameDto);
		} catch (error) {
			throw error;
		}
    }

    /**
     * It returns a promise of an array of GamesEntity objects, and it uses the
     * GamesRepo to find all the games in the database, and it also includes the
     * user1 and user2 relations
     * @returns An array of GamesEntity objects.
     */
    async findAll(): Promise<GamesEntity[]> {
        try {
            return await this.GamesRepo.find({ relations: ["user1", "user2"] });
		} catch (error) {
			throw error;
		}
    }

    /**
     * It returns a Promise of a GamesEntity object, which is the result of a query
     * to the database for a GamesEntity object with the given id, and with the
     * user1 and user2 fields populated
     * @param {number} id - number - the id of the game we want to find
     * @returns The game with the given id, and the users associated with that
     * game.
     */
    async findOne(id: number): Promise<GamesEntity> {
        try {
            return await this.GamesRepo.findOne({ where:{id}, 
                    relations: ["user1", "user2"] }
            );
		} catch (error) {
			throw error;
		}
    }

    /**
     * It takes an id and an updateGameDto, and then it updates the game with the
     * given id with the given updateGameDto
     * @param {number} id - number - The id of the game to update
     * @param {UpdateGameDto} updateGameDto - This is the DTO that we created
     * earlier.
     */
    async update(id: number, updateGameDto: UpdateGameDto): Promise<void> {
        try {
            await this.GamesRepo.update(id, updateGameDto);
		} catch (error) {
			throw error;
		}
    }

    /**
     * This function deletes a game from the database
     * @param {number} id - number - The id of the game to be deleted.
     */
    async remove(id: number): Promise<void> {
        try {
            await this.GamesRepo.delete(id);
		} catch (error) {
			throw error;
		}
    }
}
