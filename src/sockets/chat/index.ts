import { Server, Socket } from "socket.io";
import { UserChat } from "../../daos/managers";
import { Message as MessageModelMongoDB } from "../../daos/models/messages/messages.model";

class ChatSocket {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  private async emitUpdatedChats() {
    const chats = await MessageModelMongoDB.find();
    this.io.emit('messageLogs', chats);
  }

  public initializeSocket() {
    this.io.on('connection', async (socket: Socket) => {
      // Receive a new user from client and broadcast to all clients
      socket.on('newUser', async (user: string) => {
        await this.emitUpdatedChats();
        socket.broadcast.emit('alert', { message: `${user} joined the chat.` });
      });

      // Receive new message from client and broadcast to all clients
      socket.on('message', async (chat: UserChat) => {
        await MessageModelMongoDB.create(chat);
        await this.emitUpdatedChats();
      });

      // Disconnect client
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
}

export { ChatSocket };