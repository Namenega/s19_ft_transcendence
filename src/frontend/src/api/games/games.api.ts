import { API_ENDPOINT } from "../api_endpoint"
import { CreateGameDto } from "./dto/create-game.dto"
import { UpdateGameDto } from "./dto/update-game.dto"
import { GameDto } from "./dto/game.dto"
const axios = require('axios');
axios.defaults.baseURL = API_ENDPOINT;

export const addGame: (createGameDto: CreateGameDto) => Promise<GameDto> = async (createGameDto) => {
  const response = await axios.post("/games", createGameDto);
  return response.data;
}

export const getAllGames: () => Promise<GameDto[]> = async () => {
  const response = await axios.get("/games");
  return response.data;
}

export const getGame: (id: number) => Promise<GameDto | null> = async (id) => {
  const response = await axios.get(`/games/${id}`);
  if (response.data === "") { return null; }
  return response.data;
}

export const updateGame: (id: number, updateGameDto: UpdateGameDto) => void = async (id, updateGameDto) => {
  await axios.patch(`/games/${id}`, updateGameDto);
}

export const removeGame: (id: number) => void = async (id) => {
  await axios.delete(`/games/${id}`);
}