import {Environment} from "../internal";

export class ConfigurationProvider {
    public static readonly environment: Environment = Environment[process.env.REACT_APP_ENVIRONMENT?.toUpperCase() ?? Environment[Environment.LOCAL]];
    public static readonly serverUrl: string = process.env.REACT_APP_SERVER_URL!;
    public static readonly websocketUrl: string = process.env.REACT_APP_WEBSOCKET_URL!;
}