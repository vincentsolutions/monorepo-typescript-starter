import {ConfigurationProvider, container, Logger} from "../internal";
import socketIoClient from 'socket.io-client';
import {injectable} from "inversify";

@injectable()
export class SocketClient {
    private readonly _socket: SocketIOClient.Socket;

    constructor() {
        this._socket = socketIoClient(ConfigurationProvider.websocketUrl, { autoConnect: false });
    }

    public get isConnected(): boolean {
        return this._socket.connected;
    }

    public subscribeToEvents(subscriptions: Record<string, (data: any) => void>) {
        for (const key of Object.keys(subscriptions)) {
            this._socket.on(key, this.processEventSubscriptionCallback(key, subscriptions[key]));
            Logger.log(`Successfully subscribed to event: ${key}`);
        }
    }

    public emit(event: string, ...args: any[]) {
        if (!this.checkIfSocketCanBeUsed()) {
            return;
        }

        this._socket.emit(event, args);
    }

    public initConnection(accessToken: string) {
        Logger.log('Initiating WebSocket Connection...');

        this._socket
            .on('connect', () => {
                Logger.log('Unauthenticated Websocket Connection has been established.');

                this.authenticate(accessToken);
            });
        this._socket.connect();
    }

    public authenticate(accessToken: string) {
        this._socket
            .emit('authenticate', { token: accessToken })
            .on('authenticated', () => {
                Logger.log('Authenticated Websocket Connection has been established.');
            })
            .on('unauthorized', msg => {
                Logger.error(`Eror during Websocket Connection Authentication: ${JSON.stringify(msg.data)}`);
                throw new Error(msg.data.type);
            });
    }

    private processEventSubscriptionCallback(key: string, callback?: (data: string) => void) {
        return (data: string) => {
            let parsed: any;

            try {
                parsed = JSON.parse(data);

                if (!parsed || typeof parsed !== "object") {
                    parsed = data;
                }
            } catch (e) {
                parsed = data;
            }

            Logger.log(`Received WebSocket Event: ${key} with data:`);
            Logger.log(parsed);
            callback?.(parsed);
        }
    }

    private checkIfSocketCanBeUsed(): boolean {
        const canBeUsed = this._socket.connected;

        if (!canBeUsed) {
            Logger.warn('Socket is disconnected. You need to call initConnection() before emitting.');
        }

        return canBeUsed;
    }
}

container.bind(SocketClient).toSelf().inSingletonScope();