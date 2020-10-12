import {ApiClient} from "../internal";
import {AxiosRequestConfig} from "axios";
import {injectable} from "inversify";

export interface IBaseApi {

}

@injectable()
export class BaseApi implements IBaseApi {
    protected _apiClient: ApiClient;

    constructor(axiosConfig: AxiosRequestConfig = {}) {
        this._apiClient = new ApiClient(axiosConfig);
    }
}

@injectable()
export class BaseMockApi implements IBaseApi {

}