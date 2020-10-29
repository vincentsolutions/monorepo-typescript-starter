import { Injectable } from '@nestjs/common';
import {EventFactory, TCPClient, TCPConfig} from "geteventstore-promise/index";

@Injectable()
export class EventStore {
    private _client: TCPClient;
    private readonly eventFactory: EventFactory;

    public get client(): TCPClient {
        return this._client;
    }

    constructor() {
        this.eventFactory = new EventFactory();
    }

    connect(config: TCPConfig) {
        this._client = new TCPClient(config);
        return this;
    }

    newEvent(name: string, payload: any) {
        return this.eventFactory.newEvent(name, payload);
    }

    async close() {
        this._client.close();
        return this;
    }
}
