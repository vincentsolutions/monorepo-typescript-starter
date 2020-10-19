import {Injectable} from "@nestjs/common";

@Injectable()
export class Config {
    public readonly EVENT_STORE_SETTINGS = {
        protocol: 'http',
        hostname: '127.0.0.1',
        tcpPort: 1113,
        httpPort: 2113,
        credentials: {
            username: 'admin',
            password: 'changeit'
        },
        poolOptions: {
            min: 1,
            max: 10
        }
    }
}