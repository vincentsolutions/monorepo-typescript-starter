import {ApiClient, BaseStore, container, IAuthApi, ISignInResult} from "../internal";
import {inject, injectable} from "inversify";
import {action, computed, makeObservable, observable} from "mobx";

@injectable()
export class AuthStore extends BaseStore {
    @inject(Symbol.for('IAuthApi')) private readonly _authApi: IAuthApi;
    @observable public _accessToken?: string;
    @observable private _accessTokenExpiresAt?: number;

    constructor() {
        super();

        makeObservable(this);
    }

    @action public async signIn(email: string, password: string) {
        const result = await this._authApi.signIn({ email, password });
        this.handleSignInResponse(result);
    }

    @action public async signUp(email: string, password: string, firstName: string, lastName: string, phoneNumber?: string) {
        const result = await this._authApi.signUp({ email, password, firstName, lastName, phoneNumber });
        this.handleSignInResponse(result);
    }

    @action private handleSignInResponse = (result: ISignInResult) => {
        const { accessToken, accessTokenExpiresAt } = result;

        this._accessToken = accessToken;
        this._accessTokenExpiresAt = accessTokenExpiresAt;

        const apiClient = container.get(ApiClient);

        apiClient.addDefaultHeaders({
            'Authorization': `Bearer ${this._accessToken}`
        });
    }

    @computed get isAuthenticated(): boolean {
        return !!this._accessToken
            && !!this._accessTokenExpiresAt
            && new Date().getTime() > this._accessTokenExpiresAt;
    }
}

container.bind(AuthStore).toSelf().inSingletonScope();