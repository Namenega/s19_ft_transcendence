import { API_ENDPOINT } from "../api_endpoint";
import { UserDto } from "../user/dto/user.dto";
import { CreateFriendsDto } from "./dto/createFriends.dto";
import { FriendsDto } from "./dto/friends.dto";
import { UpdateFriendsDto } from "./dto/updateFriends.dto";

/* Importing the axios library and setting the baseURL to the API_ENDPOINT */
import axios from 'axios';
axios.defaults.baseURL = API_ENDPOINT;

/**
 * It takes a CreateFriendDto object and sends it to the server
 * @param createFriendDto - This is the object that we will be sending to the
 * server.
 */
export const addFriend: (createFriendDto: CreateFriendsDto) => void = async (createFriendDto) => {
	await axios.post("/friends", createFriendDto);
}

/**
 * This function takes in a user and a friend_id and returns a CreateFriendsDto
 * object
 * @param user - UserDto - this is the user that is currently logged in
 * @param friendId - The id of the user you want to add as a friend
 * @returns A function that takes in a user and a friend_id and returns a
 * CreateFriendsDto
 */
export const createNewFriend: (user: UserDto, friendId: number) => CreateFriendsDto = (user, friendId) => {
	let createFriendsDto: CreateFriendsDto = {
		user: user,
		friendId: friendId
	}
	return createFriendsDto;
}

/**
 * It returns a promise that resolves to an array of `FriendsDto` objects
 * @returns A promise that resolves to an array of FriendsDto objects.
 */
export const getAllFriends: () => Promise<FriendsDto[]> = async () => {
	const response = await axios.get("/friends");
	return response.data;
}

/**
 * It returns a promise that resolves to an array of FriendsDto objects
 * @param userLogin - string - the login of the user whose friends we want to get
 * @returns An array of FriendsDto objects
 */
export const getFriendsOfUser: (userLogin: string) => Promise<FriendsDto[]> = async (userLogin) => {
	const response = await axios.get(`/friends/users/${userLogin}`);
	return response.data;
}

/**
 * It returns a promise that resolves to a FriendsDto object, or null if the friend
 * doesn't exist
 * @param userId - The user's id
 * @param friendId - The id of the friend you want to get
 * @returns A promise that resolves to a FriendsDto object.
 */
export const getFriend: (userId: number, friendId: number) =>
		Promise<FriendsDto> = async (userId, friendId) => {
	const response = await axios.get(`/friends/${userId}/${friendId}`);
	if (response.data === "") { return null; }
	return response.data;
}

/**
 * It takes in an id and an updateFriendDto, and then it makes a patch request to
 * the friends endpoint with the id and the updateFriendDto
 * @param id - The id of the friend you want to update
 * @param updateFriendDto - This is the object that contains the data that we want
 * to update.
 */
export const updateFriend: (id: number, updateFriendDto: UpdateFriendsDto) =>
		void = async (id, updateFriendDto) => {
	await axios.patch(`/friends/${id}`, updateFriendDto);
}

/**
 * It removes a friend from the database
 * @param userId - The id of the user who is removing the friend
 * @param friendId - The id of the friend you want to remove
 * @returns A promise that resolves to a friendDto
 */
export const removeFriend: (userId: number, friendId: number) =>
		void = async (userId, friendId) => {
	const friendDto = await getFriend(userId, friendId);
	if (friendDto === null) return ;
	await axios.delete(`/friends/${friendDto.id}`);
}
