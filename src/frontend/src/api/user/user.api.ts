import { API_ENDPOINT } from "../api_endpoint";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { UserDto } from "./dto/user.dto";

/* Importing the axios library and setting the baseURL to the API_ENDPOINT. */
const axios = require('axios');
axios.defaults.baseURL = API_ENDPOINT;

/**
 * It takes a CreateUserDto and returns a Promise of a UserDto
 * @param createUserDto - CreateUserDto
 * @returns A Promise that resolves to a UserDto
 */
export const addUser: (createUserDto: CreateUserDto) =>
	Promise<UserDto> = async (createUserDto) => {
	const response = await axios.post("/users", createUserDto);
	return response.data;
}

/**
 * It creates a new user object.
 * @param name - The name of the user
 * @param login - string
 * @param avatar - The avatar of the user.
 * @param [password] - string = ""
 * @returns A function that takes in a name, login, avatar, and password and
 * returns a CreateUserDto object.
 */
export const createNewUser: (name: string, login: string, avatar: string, password?: string) =>
	CreateUserDto = (name, login, avatar, password="") => {
	let createUserDto: CreateUserDto = {
		name: name,
		login: login,
		password: password,
		avatar: avatar,
		has2FA: false,
		secret2FA: '',
		status: "Online",
		numberOfWin: 0,
		numberOfLoss: 0,
		elo: 1000,
		matchHistory: [],
		friends: [],
		dms: [],
		dms_messages: [],
		channels: [],
		channels_messages: [],
		channels_users: [],
		latestTimeOnline: Math.round(new Date().getTime() / 1000).toString()
	}
	return createUserDto;
} 

/**
 * It returns a promise that resolves to an array of UserDto objects
 * @returns A promise that resolves to an array of UserDto objects.
 */
export const getAllUsers: () => Promise<UserDto[]> = async () => {
	const response = await axios.get("/users");
	return response.data;
}
  
/**
 * It returns a promise that resolves to an array of UserDto objects
 * @returns Promise<UserDto[]>
 */
export const getAllUsersRank: () => Promise<UserDto[]> = async () => {
	const response = await axios.get("/users/rank");
	return response.data;
}
  
/**
 * It takes a number as an argument and returns a promise that resolves to a
 * UserDto or null
 * @param id - number - The id of the user to get
 * @returns A Promise that resolves to a UserDto or null.
 */
export const getUser: (id: number) => Promise<UserDto | null> = async (id) => {
	const response = await axios.get(`/users/${id}`);
	if (response.data === "") { return null; }
	return response.data;
}
  
/**
 * It takes a user id, and returns a promise that resolves to a UserDto or null
 * @param id - number - The id of the user you want to get
 * @returns A promise that resolves to a UserDto or null.
 */
export const getCompleteUser: (id: number) => Promise<UserDto | null> = async (id) => {
	const response = await axios.get(`/users/complete/${id}`);
	if (response.data === "") { return null; }
	return response.data;
}
  
/**
 * It takes a string as an argument, and returns a promise that resolves to a
 * UserDto or null
 * @param name - The name of the user to get.
 * @returns A promise that resolves to a UserDto or null.
 */
export const getUserByName: (name: string) => Promise<UserDto | null> = async (name) => {
	const response = await axios.get(`/users/name/${name}`);
	if (response.data === "") { return null; }
	return response.data;
}
  
/**
 * It takes a login string, makes a GET request to the server, and returns the user
 * object if it exists, or null if it doesn't
 * @param login - string - the login of the user we want to get
 * @returns A promise that resolves to a UserDto or null.
 */
export const getUserByLogin: (login: string) => Promise<UserDto | null> = async (login) => {
	const response = await axios.get(`/users/login/${login}`);
	if (response.data === "") { return null; }
	return response.data;
}
  
/**
 * It takes an id and an updateUserDto and makes a PATCH request to the /users/:id
 * endpoint with the updateUserDto as the body
 * @param id - The id of the user to update
 * @param updateUserDto - This is the object that contains the data that we want to
 * update.
 */
export const updateUser: (id: number, updateUserDto: UpdateUserDto) =>
		void = async (id, updateUserDto) => {
	await axios.patch(`/users/${id}`, updateUserDto)
			.catch(function (error: any) {
				if (error.response) {
					return (error.response);
				}
			});
}

/**
 * It takes a number as an argument and returns a void
 * @param id - number - the id of the user to be deleted
 */
export const removeUser: (id: number) => void = async (id) => {
	await axios.delete(`/users/${id}`);
}
  
/**
 * It returns a promise that resolves to the data returned by the GET request to
 * the `/user/2fa/secret` endpoint
 * @returns The secret key for 2FA
 */
export const get2FASecret: () => Promise<any> = async () => {
	return (await axios.get('users/2fa/secret')).data;
}

/**
 * It takes a secret and a token, and returns a promise that resolves to a boolean
 * @param secret - The secret key that was generated by the server.
 * @param token - The token that the user entered
 * @returns A boolean value.
 */
export const verify2FA: (secret: any, token: string) =>
		Promise<boolean> = async (secret, token) => {
	return (await axios.post(`users/2fa/verify`, {
		secret: secret,
		token: token
	})).data;
}

/**
 * It returns a boolean value that indicates whether or not the password is correct
 * @param id - The id of the user
 * @param password - The password to be verified.
 * @returns A boolean value.
 */
export const userPasswordVerification: (id: number, password: string) =>
		Promise<boolean> = async (id, password) => {
	const response = await axios.get(`/users/password_verification/${id}/${password}`);
	return response.data;
}
