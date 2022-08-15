import { io } from "socket.io-client";
import { GameInfosDto } from "../../pages/play/gameFunc/utils/gameInfosDto";

export const connect: () => any = () => {
  return io("http://localhost:80/game");
}

/*
** validate the game when 2 players are in the room
*/
export const listenStartGame: (socket: any, callbackFunc: (response: GameInfosDto) => void) => void = (socket, callbackFunc) => {
  socket.on('valideStartgame', callbackFunc);
}

/*
** Receive the start game informations
*/
export const startGame: (socket: any, message : {room: string, player: number, speed: number}) => void  = (socket, message) => {
  socket.emit('startgame', message);
}

/*
** Stop game loop interval in backend
*/
export const stopGame: (socket: any, message : {room: string, name: string}) => void  = (socket, message) => {
  socket.emit('stopGame', message);
}

/*
** Disconnect the socket
*/
export const disconnect : (socket: any) => void = (socket) => {
  socket.disconnect();
}

/*
** Join the room
*/
export const joinRoom: (socket: any, room: string) => void = (socket, room) => {
  socket.emit("joinRoom", room);
}

/*
** Leave the room
*/
export const leaveRoom: (socket: any, room: string) => void = (socket, room) => {
  socket.emit("leaveRoom", room);
}

/*
** Send player position
*/
export const sendPos1: (socket: any, message: {room: string, pos: number}) => void = (socket, message) => {
  socket.emit("pos1", message);
}

export const sendPos2: (socket: any,  message: {room: string, pos: number}) => void = (socket, message) => {
  socket.emit("pos2", message);
}