import {ApiClient} from "../internal";
import {inject, injectable} from "inversify";

export interface IBaseApi {

}

@injectable()
export class BaseApi implements IBaseApi {
    @inject(ApiClient) protected _apiClient: ApiClient;
}

@injectable()
export class BaseMockApi implements IBaseApi {

}