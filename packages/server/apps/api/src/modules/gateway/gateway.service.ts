import {
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Client, Server, Socket} from "socket.io";
import {Logger} from "../core/services/logger.service";
import * as socketIoJwt from 'socketio-jwt';
import {authConstants} from "../auth/constants";
import {JwtPayload} from "../auth/strategies/jwt/jwt.payload";

@WebSocketGateway(4555)
export class Gateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly userClientsMap: Map<string, string[]> = new Map<string, string[]>();

    @WebSocketServer()
    private server: Server

    constructor(
        private readonly logger: Logger
    ) {
    }

    handleConnection(client: Client, ...args: any[]) {
        this.logger.log(`Connected to socket client: ${client.id}`);
    }

    handleDisconnect(client: Client) {
        this.logger.log(`Disconnected from socket client: ${client.id}`);

        for (const [k, v] of this.userClientsMap.entries()) {
            if (v.includes(client.id)) {
                this.userClientsMap.set(k, v.filter(x => x !== client.id));
            }
        }
    }

    afterInit(server: Server): any {
        server.sockets
            .on('connection', socketIoJwt.authorize({
                secret: authConstants.accessToken.secret,
                timeout: 15000
            }))
            .on('reconnection', socketIoJwt.authorize({
                secret: authConstants.accessToken.secret,
                timeout: 15000
            }))
            .on('authenticated', this.handleAuthenticated);
    }

    private handleAuthenticated = (socket: Socket & { decoded_token: JwtPayload }) => {
        const userId = socket.decoded_token.sub;

        this.logger.log(`Authenticated to socket client: ${socket.id} with user id: ${userId}`)

        this.userClientsMap.set(userId, [
            ...(this.userClientsMap.get(userId) ?? []).filter(x => x !== socket.id),
            socket.id,
        ]);
    }

    @SubscribeMessage('events')
    private handleEvent(@MessageBody() data: string): string {
        this.logger.log(`Gateway Message Received ('events'): ${data}`);

        this.emit('server_response', 'args');

        return data;
    }

    public emit(event: string, ...args: string[]) {
        this.server.emit(event, ...args);
    }

    public emitToUsers(userIds: string[], event: string, ...args: string[]) {
        userIds.forEach(userId => this.emitToUser(userId, event, ...args));
    }

    public emitToUser(userId: string, event: string, ...args: string[]) {
        const clientIdsForUserId = this.userClientsMap.get(userId);

        if (!clientIdsForUserId || clientIdsForUserId.length === 0) {
            return;
        }

        for (const clientId of clientIdsForUserId) {
            this.server.to(clientId).emit(event, ...args);
        }
    }
}