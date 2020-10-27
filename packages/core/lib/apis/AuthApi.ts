import {BaseApi, container, IBaseApi} from "../internal";
import {injectable} from "inversify";
import {SignUpDto} from "@monorepo/server/src/modules/auth/dto/sign-up.dto";
import {SignInDto} from "@monorepo/server/src/modules/auth/dto/sign-in.dto";

export interface IAuthApi extends IBaseApi {
    signIn(dto: SignInDto): Promise<IAccessTokenResult>;
    signUp(dto: SignUpDto): Promise<IAccessTokenResult>;
    requestAccessToken(): Promise<IAccessTokenResult>;
}

@injectable()
export class AuthApi extends BaseApi implements IAuthApi {
    signUp(dto: SignUpDto): Promise<IAccessTokenResult> {
        return this._apiClient.post('/auth/signUp', dto);
    }

    signIn(dto: SignInDto): Promise<IAccessTokenResult> {
        return this._apiClient.post('/auth/signIn', dto);
    }

    requestAccessToken(): Promise<IAccessTokenResult> {
        return this._apiClient.post('/auth/requestAccessToken');
    }

}

container.bind<IAuthApi>(Symbol.for(`I${AuthApi.name}`)).to(AuthApi).inSingletonScope();

export interface IAccessTokenResult {
    accessToken: string;
    accessTokenExpiresAt: number;
}