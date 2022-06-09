import { API_ENDPOINT } from "../api_endpoint"
import { CreateMatchHistoryDto } from "./dto/create-match-history.dto"
import { UpdateMatchHistoryDto } from "./dto/update-match-history.dto"
import { MatchHistoryDto } from "./dto/match-history.dto"
import { UserDto } from "../user/dto/user.dto";
const axios = require('axios');
axios.defaults.baseURL = API_ENDPOINT;

export const addMatchHistory: (createMatchHistoryDto: CreateMatchHistoryDto) => void = async (createMatchHistoryDto) => {
  await axios.post("/match-history", createMatchHistoryDto);
}

export const createNewMatchHistory: (me: UserDto, my_score: number, opponent_id: number, opponent_score: number) => CreateMatchHistoryDto = (me, my_score, opponent_id, opponent_score) => {
  let createMatchHistoryDto: CreateMatchHistoryDto = {
    me: me,
    my_score: my_score,
    opponent_id: opponent_id,
    opponent_score: opponent_score
  }
  return createMatchHistoryDto;
}

export const getAllMatchHistory: () => Promise<MatchHistoryDto[]> = async () => {
  const response = await axios.get("/match-history");
  return response.data;
}

export const getMatchHistoryOfUser: (userLogin: string) => Promise<MatchHistoryDto[]> = async (userLogin) => {
  const response = await axios.get(`/match-history/user/${userLogin}`);
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