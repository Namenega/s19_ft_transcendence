import { API_ENDPOINT } from "../api_endpoint"
import { CreateDmDto } from "./dto/create-dm.dto"
import { UpdateDmDto } from "./dto/update-dm.dto"
import { DmDto } from "./dto/dm.dto"
import { CreateDmMessageDto } from "./dto/create-dm_message.dto"
import { UpdateDmMessageDto } from "./dto/update-dm_message.dto"
import { DmMessageDto } from "./dto/dm_message.dto"
import { UserDto } from "../user/dto/user.dto"
import axios from 'axios'
axios.defaults.baseURL = API_ENDPOINT;

export const addDm: (createDmDto: CreateDmDto) => Promise<DmDto> = async (createDmDto) => {
  const response = await axios.post("/direct-message", createDmDto);
  return response.data;
}

export const createNewDm: (user1: UserDto, user2: UserDto) => CreateDmDto = (user1, user2) => {
  let createDmDto: CreateDmDto = {
    users: [user1, user2],
    messages: [],
    block: false,
    blockerUserId: 0
  }
  return createDmDto;
}

export const getAllDms: () => Promise<DmDto[]> = async () => {
  const response = await axios.get("/direct-message");
  return response.data;
}

// export const getDmsOfUser: (userLogin: string) => Promise<DmDto[]> = async (userLogin) => {
//   const response = await axios.get(`/direct-message/user/${userLogin}`);
//   return response.data;
// }

export const getDm: (id: number) => Promise<DmDto | null> = async (id) => {
  const response = await axios.get(`/direct-message/${id}`);
  if (response.data === "") { return null; }
  return response.data;
}

export const updateDm: (id: number, updateDmDto: UpdateDmDto) => void = async (id, updateDmDto) => {
  await axios.patch(`/direct-message/${id}`, updateDmDto);
}

export const removeDm: (id: number) => void = async (id) => {
  await axios.delete(`/direct-message/${id}`);
}

export const addDmMessage: (createDmMessageDto: CreateDmMessageDto) => void = async (createDmMessageDto) => {
  await axios.post("/direct-message/message", createDmMessageDto);
}

export const createNewDmMessage: (user: UserDto, dm: DmDto, content: string, order: number) => CreateDmMessageDto = (user, dm, content, order) => {
  let createDmMessageDto: CreateDmMessageDto = {
    user: user,
    dm: dm,
    content: content,
    order: order
  }
  return createDmMessageDto;
}

export const getAllDmsMessages: () => Promise<DmMessageDto[]> = async () => {
  const response = await axios.get("/direct-message/message");
  return response.data;
}

export const getDmMessage: (id: number) => Promise<DmMessageDto> = async (id) => {
  const response = await axios.get(`/direct-message/message/${id}`);
  return response.data;
}

export const updateDmMessage: (id: number, updateDmMessageDto: UpdateDmMessageDto) => void = async (id, updateDmMessageDto) => {
  await axios.patch(`/direct-message/message/${id}`, updateDmMessageDto);
}

export const removeDmMessage: (id: number) => void = async (id) => {
  await axios.delete(`/direct-message/message/${id}`);
}
