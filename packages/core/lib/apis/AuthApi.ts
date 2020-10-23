import {BaseApi, container, IBaseApi} from "../internal";
import {injectable} from "inversify";
import {SignUpDto} from "@monorepo/server/src/modules/auth/dto/sign-up.dto";
import {SignInDto} from "@monorepo/server/src/modules/auth/dto/sign-in.dto";

export interface IAuthApi extends IBaseApi {
    signIn(dto: SignInDto): Promise<ISignInResult>;
    signUp(dto: SignUpDto): Promise<ISignInResult>;
}

@injectable()
export class AuthApi extends BaseApi implements IAuthApi {
    signIn(dto: SignInDto): Promise<ISignInResult> {
        return this._apiClient.post('/auth/signIn', dto);
    }

    signUp(dto: SignUpDto): Promise<ISignInResult> {
        return this._apiClient.post('/auth/signUp', dto);
    }

}

container.bind<IAuthApi>(Symbol.for(`I${AuthApi.name}`)).to(AuthApi).inSingletonScope();

export interface ISignInResult {
    accessToken: string;
    accessTokenExpiresAt: number;
}