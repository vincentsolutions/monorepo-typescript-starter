import {
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Client, Server} from "socket.io";
import {Logger} from "../core/services/logger.service";
import * as socketIoJwt from 'socketio-jwt';
import {jwtConstants} from "../auth/constants";

@WebSocketGateway(4555)
export class Gateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    public server: Server

    constructor(
        private readonly logger: Logger
    ) {
    }

    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string): string {
        this.logger.log(`Gateway Message Received ('events'): ${data}`);

        return data;
    }

    handleConnection(client: Client, ...args: any[]) {
        this.logger.log(`Connected to socket client: ${client.id}`);
    }

    handleDisconnect(client: Client) {
        this.logger.log(`Disconnected from socket client: ${client.id}`);
    }

    afterInit(server: Server): any {
        server.sockets
            .on('connection', socketIoJwt.authorize({
                secret: jwtConstants.secret,
                timeout: 15000
            }))
            .on('authenticated', socket => {
                console.log(`hello! ${JSON.stringify(socket.decoded_token)}`)
            })
    }
}