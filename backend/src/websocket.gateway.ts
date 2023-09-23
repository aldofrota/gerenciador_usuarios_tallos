// websockets.gateway.ts

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

  handleConnection(client: any) {
    console.log(client.id);
    const payload = client.handshake.query.user;
    const user = JSON.parse(payload);

    this.server.emit(
      'message',
      `Novo Usuario logado, Usuário: ${user.usuario}`,
    );
  }

  handleDisconnect(client: any) {
    // console.log(client);
    // Lógica a ser executada quando um cliente se desconectar
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    console.log(client);
    console.log('Mensagem recebida do cliente:', payload);
  }
}
