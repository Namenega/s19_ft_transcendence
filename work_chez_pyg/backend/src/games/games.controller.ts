import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { GamesService } from "./games.service";

/* The GamesController class is a controller that uses the GamesService class to
handle HTTP requests to the /games endpoint */
@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    /**
     * The function takes a CreateGameDto object as a parameter, and returns a
     * Promise of a Game object
     * @param {CreateGameDto} createGameDto - This is the DTO that we created
     * earlier.
     * @returns The create method is being returned.
     */
    @Post()
    create(@Body() createGameDto: CreateGameDto) {
        return this.gamesService.create(createGameDto);
    }

    /**
     * It returns the result of calling the findAll() function on the gamesService
     * object
     * @returns An array of games
     */
    @Get()
    findAll() {
        return this.gamesService.findAll();
    }

    /**
     * The `@Param('id', ParseIntPipe)` decorator tells NestJS to use the
     * `ParseIntPipe` to convert the `id` parameter to a number
     * @param {number} id - The id of the game we want to retrieve.
     * @returns The game with the id of 1
     */
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.gamesService.findOne(+id);
    }

    /**
     * The function takes in an id and a body, and then calls the update function
     * in the games service
     * @param {number} id - The id of the game to update.
     * @param {UpdateGameDto} updateGameDto - This is the DTO that we created
     * earlier.
     */
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateGameDto: UpdateGameDto) {
        this.gamesService.update(+id, updateGameDto);
    }

    /**
     * The function takes an id as a parameter, and then passes that id to the
     * remove function in the gamesService
     * @param {number} id - The id of the game to remove.
     */
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        this.gamesService.remove(+id);
    }
}
