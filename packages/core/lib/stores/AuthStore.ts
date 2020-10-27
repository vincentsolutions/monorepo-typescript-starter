import {ApiClient, BaseStore, container, IAuthApi, IAccessTokenResult, SocketClient, lazyInject} from "../internal";
import {inject, injectable} from "inversify";
import {action, computed, makeObservable, observable} from "mobx";
import {Symbols} from "../ioc/symbols";
import * as Jwt from "jsonwebtoken";
import moment from "moment";
import { History } from 'history';
import {IJwtPayload} from "@monorepo/shared-kernel";

@injectable()
export class AuthStore extends BaseStore {
    @lazyInject(Symbols.constants.history) private readonly _history: History;
    @inject(Symbols.apis.auth) private readonly _authApi: IAuthApi;
    @inject(SocketClient) private readonly _socketClient: SocketClient;
    @observable public _accessToken?: string;
    @observable private _accessTokenExpiresAt?: number;
    @observable private _identity?: IJwtPayload;

    @computed get identity(): IJwtPayload | undefined {
        return this._identity;
    }

    constructor() {
        super();

        makeObservable(this);
    }

    @action public async signIn(email: string, password: string) {
        const result = await this._authApi.signIn({ email, password });
        this.handleAccessTokenResponse(result);
        this._history.push('/auth/account');
    }

    @action public async signUp(email: string, password: string, firstName: string, lastName: string, phoneNumber?: string) {
        const result = await this._authApi.signUp({ email, password, firstName, lastName, phoneNumber });
        this.handleAccessTokenResponse(result);
    }

    @action public async requestAccessToken() {
        try {
            const result = await this._authApi.requestAccessToken();
            this.handleAccessTokenResponse(result);
        } catch (e) {
            this._history.push('/unauth/signIn');
        }
    }

    @action private handleAccessTokenResponse = (result: IAccessTokenResult) => {
        const { accessToken, accessTokenExpiresAt } = result;

        this._identity = Jwt.decode(accessToken, { json: true }) as IJwtPayload;
        this._accessToken = accessToken;
        this._accessTokenExpiresAt = accessTokenExpiresAt;

        const apiClient = container.get(ApiClient);

        apiClient.addDefaultHeaders({
            'Authorization': `Bearer ${this._accessToken}`
        });

        if (!this._socketClient.isConnected) {
            this._socketClient.initConnection(this._accessToken);
        } else {
            this._socketClient.authenticate(this._accessToken);
        }

        const timeUntilTokenExpiration = moment.unix(this._accessTokenExpiresAt).diff(moment(), 'milliseconds');
        setTimeout(() => this.requestAccessToken(), timeUntilTokenExpiration * 0.90 )
    }

    @computed get isAuthenticated(): boolean {
        return !!this._accessToken
            && !!this._accessTokenExpiresAt
            && new Date().getTime() > this._accessTokenExpiresAt;
    }
}

container.bind(AuthStore).toSelf().inSingletonScope();