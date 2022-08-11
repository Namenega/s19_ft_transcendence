import { API_ENDPOINT } from "../api_endpoint"
import { CreateMatchHistoryDto } from "./dto/create-match-history.dto"
import { UpdateMatchHistoryDto } from "./dto/update-match-history.dto"
import { MatchHistoryDto } from "./dto/match-history.dto"
import { UserDto } from "../user/dto/user.dto";
import axios from 'axios';
axios.defaults.baseURL = API_ENDPOINT;

export const addMatchHistory: (createMatchHistoryDto: CreateMatchHistoryDto) => void = async (createMatchHistoryDto) => {
  await axios.post("/match-history", createMatchHistoryDto);
}

export const createNewMatchHistory: (user: UserDto, userScore: number, opponentId: number, opponentScore: number) => CreateMatchHistoryDto = (user, userScore, opponentId, opponentScore) => {
  let createMatchHistoryDto: CreateMatchHistoryDto = {
    user: user,
    userScore: userScore,
    opponentId: opponentId,
    opponentScore: opponentScore
  }
  return createMatchHistoryDto;
}

export const getAllMatchHistory: () => Promise<MatchHistoryDto[]> = async () => {
  const response = await axios.get("/match-history");
  return response.data;
}

export const getMatchHistoryOfUser: (userLogin: string) => Promise<MatchHistoryDto[]> = async (userLogin) => {
  const response = await axios.get(`/match-history/users/${userLogin}`);
  return response.data;
}

export const getMatchHistory: (id: number) => Promise<MatchHistoryDto> = async (id) => {
  const response = await axios.get(`/match-history/${id}`);
  return response.data;
}

export const updateMatchHistory: (id: number, updateMatchHistoryDto: UpdateMatchHistoryDto) => void = async (id, updateMatchHistoryDto) => {
  await axios.patch(`/match-history/${id}`, updateMatchHistoryDto);
}

export const removeMatchHistory: (id: number) => void = async (id) => {
  await axios.delete(`/match-history/${id}`);
}