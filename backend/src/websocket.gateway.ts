import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;
  users = [];

  handleConnection(client: any) {
    const payload = client.handshake.query.user;
    const user = JSON.parse(payload);
    user.id_socket = client.id;

    if (user.token) {
      const exists = this.users.filter(
        (userslogged) => userslogged.email === user.email,
      );

      if (!exists[0]) {
        this.users.push(user);
      }

      this.server.emit('connected', this.users);
    }
  }

  handleDisconnect(client: Socket) {
    const idx = this.users.findIndex(
      (objeto) => objeto.id_socket === client.id,
    );

    if (idx !== -1) {
      this.users.splice(idx, 1); // Remove 1 elemento a partir do índice encontrado
    }
    this.server.emit('desconnected', this.users);
  }

  // @SubscribeMessage('register')
  // handleMessageRegisterUser(client: Socket, payload: any) {
  //   console.log('Mensagem recebida do cliente:', payload);
  // }
}
