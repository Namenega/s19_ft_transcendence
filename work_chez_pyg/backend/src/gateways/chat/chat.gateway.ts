import { IsNotEmpty, IsString } from "class-validator";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";

class Message {
	@IsNotEmpty()
	@IsString()
	room: string

	@IsString()
	content: string
}
  
/* It listens for messages called 'message', 'joinRoom', and 'leaveRoom' and then
it emits messages to the room that the message was sent to */
@WebSocketGateway(80, { namespace: 'chat', cors: true })
export class ChatGateway {
	@WebSocketServer()
	server: Server;
  
	/* A decorator that is listening for a message called 'message' and then it is
	emitting a message to the room that the message was sent to. */
	@SubscribeMessage('message')
	handleMessage(client: Socket, message: Message): void {
		this.server.to(message.room).emit("message", message.content)
	}
  
	/* Listening for a message called 'joinRoom' and then it is joining the room that
	the message was sent to. */
	@SubscribeMessage('joinRoom')
	joinRoom(client: Socket, room: string): void {
		client.join(room);
	}
  
	/* Listening for a message called 'leaveRoom' and then it is leaving the room that
		the message was sent to. */
	@SubscribeMessage('leaveRoom')
	leaveRoom(client: Socket, room: string): void {
		client.leave(room);
	}
}
